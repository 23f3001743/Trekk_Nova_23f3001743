
from flask import Blueprint, request, jsonify
from extensions import db, get_from_cache, save_to_cache, clear_cache_pattern
from models.user    import User
from models.trek    import Trek
from models.booking import Booking
from utils import only_admin
from datetime import datetime

admin_bp = Blueprint('admin', __name__)


# ─────────────────────────────
# DASHBOARD 
# ─────────────────────────────
@admin_bp.route('/dashboard', methods=['GET'])
@only_admin
def dashboard():
    cache_key = 'admin:dash:stats'
    cached    = get_from_cache(cache_key)

    if cached:
        return jsonify(cached), 200

    total_trekkers = User.query.filter_by(role='trekker').count()
    total_guides   = User.query.filter_by(role='staff').count()
    total_treks    = Trek.query.count()
    total_bookings = Booking.query.count()
    active_treks   = Trek.query.filter_by(current_status='Open').count()

    
    recent = Booking.query.order_by(
        Booking.booked_at.desc()
    ).limit(5).all()

    result = {
        'stats': {
            'total_trekkers': total_trekkers,
            'total_guides'  : total_guides,
            'total_treks'   : total_treks,
            'total_bookings': total_bookings,
            'active_treks'  : active_treks
        },
        'recent_activity': [b.to_dict() for b in recent]
    }

    save_to_cache(cache_key, result, 300)
    return jsonify(result), 200


# ─────────────────────────────
# CREATE NEW TREK
# ─────────────────────────────
@admin_bp.route('/treks', methods=['POST'])
@only_admin
def create_trek():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'msg': 'No data received'}), 400

    
    required = ['title', 'region', 'difficulty_level',
                'days_required', 'capacity',
                'trip_start', 'trip_end', 'cost_per_person']

    for field in required:
        if not str(data.get(field, '')).strip():
            return jsonify({'msg': f'{field} is required'}), 400

    if data['difficulty_level'] not in ['Easy', 'Moderate', 'Hard']:
        return jsonify({'msg': 'Difficulty must be Easy, Moderate or Hard'}), 400

    try:
        t_start = datetime.strptime(data['trip_start'], '%Y-%m-%d').date()
        t_end   = datetime.strptime(data['trip_end'],   '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'msg': 'Date format must be YYYY-MM-DD'}), 400

    if t_end <= t_start:
        return jsonify({'msg': 'Trip end must be after trip start'}), 400

    seats = int(data['capacity'])

    trek = Trek(
        title            = data['title'].strip(),
        region           = data['region'].strip(),
        overview         = data.get('overview', ''),
        cover_image      = data.get('cover_image', ''),
        difficulty_level = data['difficulty_level'],
        days_required    = int(data['days_required']),
        capacity         = seats,
        seats_remaining  = seats,
        cost_per_person  = float(data['cost_per_person']),
        trip_start       = t_start,
        trip_end         = t_end,
        current_status   = 'Open',
        image_key = data.get('image_key', '')
    )

    db.session.add(trek)
    db.session.commit()

    
    clear_cache_pattern('treks:*')
    clear_cache_pattern('admin:dash:*')

    return jsonify({
        'msg' : 'Trek created successfully',
        'trek': trek.to_dict()
    }), 201


# ─────────────────────────────
# GET ALL TREKS
# ─────────────────────────────
@admin_bp.route('/treks', methods=['GET'])
@only_admin
def get_all_treks():
    all_treks = Trek.query.order_by(Trek.listed_on.desc()).all()
    return jsonify({'treks': [t.to_dict() for t in all_treks]}), 200


# ─────────────────────────────
# UPDATE A TREK
# ─────────────────────────────
@admin_bp.route('/treks/<int:tid>', methods=['PUT'])
@only_admin
def update_trek(tid):
    trek = Trek.query.get(tid)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

    data = request.get_json(force=True, silent=True) or {}

    if 'title'           in data: trek.title           = data['title']
    if 'region'          in data: trek.region          = data['region']
    if 'overview'        in data: trek.overview        = data['overview']
    if 'difficulty_level'in data: trek.difficulty_level= data['difficulty_level']
    if 'days_required'   in data: trek.days_required   = int(data['days_required'])
    if 'cost_per_person' in data: trek.cost_per_person = float(data['cost_per_person'])
    if 'current_status'  in data: trek.current_status  = data['current_status']
    if 'cover_image'     in data: trek.cover_image     = data['cover_image']
    if 'capacity'        in data:
        trek.capacity        = int(data['capacity'])
        trek.seats_remaining = int(data['capacity'])

    if 'image_key' in data: trek.image_key = data['image_key']
    
    db.session.commit()
    clear_cache_pattern('treks:*')
    clear_cache_pattern('admin:dash:*')

    return jsonify({
        'msg' : 'Trek updated',
        'trek': trek.to_dict()
    }), 200


# ─────────────────────────────
# DELETE A TREK
# ─────────────────────────────
@admin_bp.route('/treks/<int:tid>', methods=['DELETE'])
@only_admin
def delete_trek(tid):
    trek = Trek.query.get(tid)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

    db.session.delete(trek)
    db.session.commit()
    clear_cache_pattern('treks:*')
    clear_cache_pattern('admin:dash:*')

    return jsonify({'msg': 'Trek removed'}), 200


# ─────────────────────────────
# ADD GUIDE (STAFF)
# ─────────────────────────────
@admin_bp.route('/guides', methods=['POST'])
@only_admin
def add_guide():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'msg': 'No data received'}), 400

    for field in ['full_name', 'email', 'password', 'contact_no']:
        if not str(data.get(field, '')).strip():
            return jsonify({'msg': f'{field} is required'}), 400

    if User.query.filter_by(email=data['email'].lower()).first():
        return jsonify({'msg': 'Email already registered'}), 409

    guide = User(
        full_name  = data['full_name'].strip(),
        email      = data['email'].lower().strip(),
        contact_no = data['contact_no'],
        role       = 'staff'
    )
    guide.set_password(data['password'])

    db.session.add(guide)
    db.session.commit()

    return jsonify({
        'msg'  : 'Guide added successfully',
        'guide': guide.to_dict()
    }), 201


@admin_bp.route('/guides', methods=['GET'])
@only_admin
def get_all_guides():
    guides = User.query.filter_by(role='staff').all()
    return jsonify({'guides': [g.to_dict() for g in guides]}), 200


# ─────────────────────────────
# ASSIGN GUIDE TO TREK
# ─────────────────────────────
@admin_bp.route('/treks/<int:tid>/assign', methods=['PUT'])
@only_admin
def assign_guide(tid):
    trek = Trek.query.get(tid)
    if not trek:
        return jsonify({'msg': 'Trek not found'}), 404

    data     = request.get_json(force=True, silent=True) or {}
    guide_id = data.get('guide_id')

    if not guide_id:
        return jsonify({'msg': 'guide_id is required'}), 400

    guide = User.query.filter_by(id=guide_id, role='staff').first()
    if not guide:
        return jsonify({'msg': 'Guide not found'}), 404

    trek.guide_id = guide_id
    db.session.commit()

    return jsonify({
        'msg' : f'{guide.full_name} assigned to {trek.title}',
        'trek': trek.to_dict()
    }), 200


# ─────────────────────────────
#  TREKKERS by search
# ─────────────────────────────
@admin_bp.route('/trekkers', methods=['GET'])
@only_admin
def get_all_trekkers():
    search = request.args.get('q', '')
    query  = User.query.filter_by(role='trekker')

    if search:
        query = query.filter(
            db.or_(
                User.full_name.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%')
            )
        )

    trekkers = query.order_by(User.joined_on.desc()).all()
    return jsonify({'trekkers': [u.to_dict() for u in trekkers]}), 200


# ─────────────────────────────
# BAN / DEACTIVATE USER
# ─────────────────────────────
@admin_bp.route('/users/<int:uid>/status', methods=['PUT'])
@only_admin
def change_user_status(uid):
    user = User.query.get(uid)
    if not user:
        return jsonify({'msg': 'User not found'}), 404

    if user.role == 'admin':
        return jsonify({'msg': 'Cannot modify admin account'}), 403

    data = request.get_json(force=True, silent=True) or {}

    if 'is_active' in data: user.is_active = data['is_active']
    if 'is_banned' in data: user.is_banned = data['is_banned']

    db.session.commit()

    what = 'banned' if user.is_banned else (
           'deactivated' if not user.is_active else 'activated')

    return jsonify({
        'msg' : f'{user.full_name} has been {what}',
        'user': user.to_dict()
    }), 200


# ─────────────────────────────
# GET ALL BOOKINGS
# ─────────────────────────────
@admin_bp.route('/bookings', methods=['GET'])
@only_admin
def get_all_bookings():
    all_bookings = Booking.query.order_by(
        Booking.booked_at.desc()
    ).all()
    return jsonify({'bookings': [b.to_dict() for b in all_bookings]}), 200


# ─────────────────────────────
# CHART DATA
# ─────────────────────────────
@admin_bp.route('/charts', methods=['GET'])
@only_admin
def get_chart_data():
    from sqlalchemy import func
    from datetime import timedelta

    
    per_trek = db.session.query(
        Trek.title,
        func.count(Booking.id).label('total')
    ).join(Booking, Trek.id == Booking.trek_id, isouter=True)\
     .group_by(Trek.id)\
     .order_by(func.count(Booking.id).desc())\
     .limit(6).all()

    
    by_diff = db.session.query(
        Trek.difficulty_level,
        func.count(Trek.id).label('total')
    ).group_by(Trek.difficulty_level).all()

    
    by_status = db.session.query(
        Booking.booking_status,
        func.count(Booking.id).label('total')
    ).group_by(Booking.booking_status).all()

    
    monthly = []
    for i in range(5, -1, -1):
        m_date  = datetime.utcnow() - timedelta(days=30*i)
        m_start = m_date.replace(day=1, hour=0, minute=0, second=0)
        if i > 0:
            m_end = (
                datetime.utcnow() - timedelta(days=30*(i-1))
            ).replace(day=1, hour=0, minute=0, second=0)
        else:
            m_end = datetime.utcnow()

        cnt = Booking.query.filter(
            Booking.booked_at >= m_start,
            Booking.booked_at <= m_end
        ).count()

        monthly.append({
            'month': m_date.strftime('%b %Y'),
            'count': cnt
        })

    return jsonify({
        'per_trek'    : [{'trek': r.title,           'count': r.total} for r in per_trek],
        'difficulty'  : [{'label': r.difficulty_level,'count': r.total} for r in by_diff],
        'by_status'   : [{'label': r.booking_status,  'count': r.total} for r in by_status],
        'monthly'     : monthly
    }), 200
