# this is trekker_routes.py where trkkers can browse,book or cancel there treks also can see the history.


from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db, get_from_cache, save_to_cache
from models.user    import User
from models.trek    import Trek
from models.booking import Booking
import random
import string

trekker_bp = Blueprint('trekker', __name__)



@trekker_bp.route('/home', methods=['GET'])
@jwt_required()
def home():
    uid  = get_jwt_identity()
    user = User.query.get(uid)

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    my_bookings = Booking.query.filter_by(
        trekker_id=uid
    ).order_by(Booking.booked_at.desc()).all()

    open_treks = Trek.query.filter_by(
        current_status='Open'
    ).order_by(Trek.trip_start.asc()).all()

    return jsonify({
        'user'       : user.to_dict(),
        'summary'    : {
            'total_bookings': len(my_bookings),
            'active'        : sum(1 for b in my_bookings
                                if b.booking_status == 'Booked'),
            'completed'     : sum(1 for b in my_bookings
                                if b.booking_status == 'Completed'),
            'cancelled'     : sum(1 for b in my_bookings
                                if b.booking_status == 'Cancelled')
        },
        'my_bookings': [b.to_dict() for b in my_bookings],
        'open_treks' : [t.to_dict() for t in open_treks]
    }), 200


# TREKKER DASHBOARD
#____________________

@trekker_bp.route('/treks', methods=['GET'])
@jwt_required()
def browse_treks():
    keyword    = request.args.get('q', '')
    difficulty = request.args.get('difficulty', '')
    region     = request.args.get('region', '')

    
    cache_key = f"treks:list:{keyword}:{difficulty}:{region}"

    cached = get_from_cache(cache_key)
    if cached:
        return jsonify(cached), 200

    
    query = Trek.query.filter_by(current_status='Open')

    if keyword:
        query = query.filter(
            db.or_(
                Trek.title.ilike(f'%{keyword}%'),
                Trek.region.ilike(f'%{keyword}%'),
                Trek.overview.ilike(f'%{keyword}%')
            )
        )

    if difficulty:
        query = query.filter(
            Trek.difficulty_level == difficulty
        )

    if region:
        query = query.filter(
            Trek.region.ilike(f'%{region}%')
        )

    treks = query.order_by(Trek.trip_start.asc()).all()

    result = {
        'total': len(treks),
        'treks': [t.to_dict() for t in treks]
    }

    
    save_to_cache(cache_key, result, 300)

    return jsonify(result), 200


# BOOKING A TREKK
#_________________

@trekker_bp.route('/book', methods=['POST'])
@jwt_required()
def book_trek():
    uid  = get_jwt_identity()
    user = User.query.get(uid)

    if not user:
        return jsonify({'msg': 'User not found'}), 404

    if user.is_banned:
        return jsonify({'msg': 'Your account is banned'}), 403

    data    = request.get_json(force=True, silent=True) or {}
    trek_id = data.get('trek_id')

    if not trek_id:
        return jsonify({'msg': 'trek_id is required'}), 400

    trek = Trek.query.get(trek_id)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

    
    if trek.current_status != 'Open':
        return jsonify({'msg': f'Trek is {trek.current_status}'}), 400

    
    if trek.seats_remaining <= 0:
        return jsonify({'msg': 'No seats available'}), 400

    
    already = Booking.query.filter_by(
        trekker_id=uid,
        trek_id=trek_id
    ).first()

    if already:
        return jsonify({'msg': 'You already booked this trek'}), 409

    
    booking = Booking(
        trekker_id     = uid,
        trek_id        = trek_id,
        booking_status = 'Booked'
    )

    
    trek.seats_remaining -= 1

    
    if trek.seats_remaining == 0:
        trek.current_status = 'Closed'

    db.session.add(booking)
    db.session.commit()

    return jsonify({
        'msg'    : f'Successfully booked {trek.title}!',
        'booking': booking.to_dict()
    }), 201


# TREKKERS BOOKING
#__________________


@trekker_bp.route('/my-bookings', methods=['GET'])
@jwt_required()
def my_bookings():
    uid = get_jwt_identity()

    bookings = Booking.query.filter_by(
        trekker_id=uid
    ).order_by(Booking.booked_at.desc()).all()

    return jsonify({
        'total'   : len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200



@trekker_bp.route('/bookings/<int:bid>/cancel', methods=['PUT'])
@jwt_required()
def cancel_booking(bid):
    uid     = get_jwt_identity()
    booking = Booking.query.get(bid)

    if not booking:
        return jsonify({'msg': 'Booking not found'}), 404

    if str(booking.trekker_id) != str(uid):
        return jsonify({'msg': 'Not your booking'}), 403

    if booking.booking_status == 'Cancelled':
        return jsonify({'msg': 'Already cancelled'}), 400

    if booking.booking_status == 'Completed':
        return jsonify({'msg': 'Cannot cancel completed trek'}), 400

    booking.booking_status          = 'Cancelled'
    booking.trek_info.seats_remaining += 1

    # reopen if was closed due to full seats
    if booking.trek_info.current_status == 'Closed':
        booking.trek_info.current_status = 'Open'

    db.session.commit()

    return jsonify({
        'msg'    : 'Booking cancelled successfully',
        'booking': booking.to_dict()
    }), 200


# trek history 
@trekker_bp.route('/history', methods=['GET'])
@jwt_required()
def my_history():
    uid = get_jwt_identity()

    done = Booking.query.filter_by(
        trekker_id     = uid,
        booking_status = 'Completed'
    ).order_by(Booking.booked_at.desc()).all()

    return jsonify({
        'total'  : len(done),
        'history': [b.to_dict() for b in done]
    }), 200

# full booking details history for trekker
@trekker_bp.route('/my-history', methods=['GET'])
@jwt_required()
def full_history():
    uid    = get_jwt_identity()
    status = request.args.get('status', '')

    query = Booking.query.filter_by(trekker_id=uid)

    if status:
        query = query.filter(
            Booking.booking_status == status
        )

    bookings = query.order_by(
        Booking.booked_at.desc()
    ).all()

    return jsonify({
        'total'   : len(bookings),
        'bookings': [b.to_dict() for b in bookings]
    }), 200

# dummy payment for booking
@trekker_bp.route('/bookings/<int:bid>/pay', methods=['POST'])
@jwt_required()
def pay_booking(bid):
    uid     = get_jwt_identity()
    booking = Booking.query.get(bid)

    if not booking:
        return jsonify({'msg': 'Booking not found'}), 404

    if str(booking.trekker_id) != str(uid):
        return jsonify({'msg': 'Not your booking'}), 403

    if booking.payment_status == 'Paid':
        return jsonify({'msg': 'Already paid'}), 400

    if booking.booking_status == 'Cancelled':
        return jsonify({'msg': 'Cannot pay for cancelled booking'}), 400

    data = request.get_json(force=True, silent=True) or {}

    card_no   = str(data.get('card_number', ''))
    card_name = data.get('card_name', '')
    expiry    = data.get('card_expiry', '')
    cvv       = str(data.get('card_cvv', ''))

    if not all([card_no, card_name, expiry, cvv]):
        return jsonify({'msg': 'All card details needed'}), 400

    if len(card_no) != 16:
        return jsonify({'msg': 'Card number must be 16 digits'}), 400

    if len(cvv) != 3:
        return jsonify({'msg': 'CVV must be 3 digits'}), 400

    # generate fake payment reference
    fake_ref = 'TRK' + ''.join(
        random.choices(string.ascii_uppercase + string.digits, k=9)
    )

    booking.payment_status = 'Paid'
    booking.payment_ref    = fake_ref
    booking.amount_paid    = booking.trek_info.cost_per_person

    db.session.commit()

    return jsonify({
        'msg'        : 'Payment successful!',
        'payment_ref': fake_ref,
        'amount'     : booking.amount_paid,
        'booking'    : booking.to_dict()
    }), 200


# TRIGGERING CSV


@trekker_bp.route('/export', methods=['POST'])
@jwt_required()
def export_csv():
    uid = get_jwt_identity()
    try:
        # run directly without celery for now
        from jobs.bg_tasks import do_csv_export
        result = do_csv_export(int(uid))
        if result:
            return jsonify({'msg': 'CSV sent to your email!'}), 200
        else:
            return jsonify({'msg': 'Export failed, check email config'}), 500
    except Exception as e:
        print(f"Export error: {e}")
        return jsonify({'msg': f'Error: {str(e)}'}), 500
