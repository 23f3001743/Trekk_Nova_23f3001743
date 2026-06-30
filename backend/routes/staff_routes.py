# staff_routes responsible for trek guiders and 
# they can manage there assigned trekks

from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from extensions import db
from models.trek import Trek
from models.booking import Booking
from utils import only_guide

staff_bp = Blueprint('staff', __name__)


#GUIDE DASHBOARD


@staff_bp.route('/dashboard', methods=['GET'])
@only_guide
def dashboard():
    guide_id = get_jwt_identity()

    my_treks = Trek.query.filter_by(
        guide_id = guide_id
    ).all()


    trek_ids = [t.id for t in  my_treks]
    total_participants = Booking.query.filter(
        Booking.trek_id.in_(trek_ids)
    ).count() if trek_ids else 0

    return jsonify({
        'stats': {
            'assigned_treks'   : len(my_treks),
            'total_participants': total_participants
        },
        'treks' : [t.to_dict() for t in my_treks]
    }), 200


# ASSIGNED TREKS

@staff_bp.route('/treks', methods=['GET'])
@only_guide
def get_my_treks():
    guide_id = get_jwt_identity()
    my_treks = Trek.query.filter_by(
        guide_id = guide_id 
    ).all()

    return jsonify({'treks': [t.to_dict()  for t in my_treks]}) , 200


# UPDATING TREK STATUS 

@staff_bp.route('/treks/<int:tid>' , methods = ['PUT'])
@only_guide
def update_trek(tid):
    guide_id = get_jwt_identity()
    trek = Trek.query.get(tid)

    if not trek:
        return jsonify({'msg' : 'Trek not found'}), 404

    if str(trek.guide_id) != str(guide_id):
        return jsonify({ 'msg' : 'This trek is not assigned to you'}), 403

    data = request.get_json(force=True, silent=True) or {}

    if 'current_status' in data:
        allowed = ['Open', 'Closed', 'Completed']
        if data['current_status'] not in allowed:
            return jsonify({ 'msg': f'Status must be one of {allowed}'}),400
        trek.current_status = data['current_status']


    if 'seats_remaining' in data:
        seats = int(data['seats_remaining'])
        if seats < 0:
            return jsonify({'msg': 'Seats cannot be negative'}), 400
        if seats > trek.capacity:
            return jsonify({'msg': f'Cannot exceed total capacity ({trek.capacity})'}), 400
        trek.seats_remaining = seats

    db.session.commit()

    return jsonify({
        'msg' : 'Trek updated successfully',
        'trek': trek.to_dict()
    }), 200


# VIEW PARTICIPANTS 


@staff_bp.route('/treks/<int:tid>/participants', methods=['GET'])
@only_guide
def get_participants(tid):
    guide_id = get_jwt_identity()

    trek = Trek.query.get(tid)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

   
    if str(trek.guide_id) != str(guide_id):
        return jsonify({'msg': 'This trek is not assigned to you'}), 403

    bookings = Booking.query.filter_by(trek_id=tid).all()

    people = []
    for b in bookings:
        people.append({
            'booking_id'   : b.id,
            'trekker_id'   : b.trekker_id,
            'name'         : b.trekker_info.full_name,
            'email'        : b.trekker_info.email,
            'contact_no'   : b.trekker_info.contact_no,
            'fitness_level': b.trekker_info.fitness_level,
            'booked_on'    : b.booked_at.strftime('%Y-%m-%d'),
            'status'       : b.booking_status
        })

    return jsonify({
        'trek'        : trek.to_dict(),
        'total'       : len(people),
        'participants': people
    }), 200


# MARK TREK AS COMPLETED

@staff_bp.route('/treks/<int:tid>/finish', methods=['PUT'])
@only_guide
def finish_trek(tid):
    guide_id = get_jwt_identity()

    trek = Trek.query.get(tid)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

    if str(trek.guide_id) != str(guide_id):
        return jsonify({'msg': 'This trek is not assigned to you'}), 403

    if trek.current_status == 'Completed':
        return jsonify({'msg': 'Trek already completed'}), 400

    trek.current_status = 'Completed'

    Booking.query.filter_by(
        trek_id=tid,
        booking_status='Booked'
    ).update({'booking_status': 'Completed'})

    db.session.commit()

    return jsonify({
        'msg' : f'{trek.title} marked as completed!',
        'trek': trek.to_dict()
    }), 200



