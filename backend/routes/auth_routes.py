# this file contain the login, register and profile routes

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'msg': 'No data received'}), 400

    for field in ['full_name', 'email', 'password']:
        if not data.get(field, '').strip():
            return jsonify({'msg':f'{field} is required'}), 400

    if len(data['password']) < 6:
        return jsonify({'msg' : 'Password must be at least 6 characters'}), 400

    existing = User.query.filter_by(email=data['email'].lower().strip()).first()
    if existing:
        return jsonify({'msg':'Email already registered'}), 409

    new_user = User(
        full_name  = data['full_name'].strip(),
        email  = data['email'].lower().strip(),
        contact_no =  data.get('contact_no', ''),
        age =  data.get('age'),
        fitness_level =  data.get('fitness_level','beginner'),
        role =  'trekker'
    )

    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'msg' : 'Account created successfully! Please login.' ,
        'user' : new_user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'msg' : 'No data received'}), 400

    email  = data.get('email' , '').lower().strip()
    password = data.get('password' , '')

    if not email or not password:
        return jsonify({ 'msg' : 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.verify_password(password):
        return jsonify({'msg': 'Invalid email or password'}), 401

    if user.is_banned:
        return jsonify({'msg' : 'Account banned, contact admin'}), 403

    if not user.is_active:
        return jsonify({'msg' : 'Account deactivated, contact admin'}), 403

    token = create_access_token(
        identity=str(user.id),
        additional_claims={'role':user.role}
    )

    return jsonify({
        'msg': f'Welcome back, {user.full_name}!',
        'token' : token,
        'user' : user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({'msg' : 'User not found'}) , 404

    return jsonify({'user': user.to_dict()}), 200



@auth_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_profile():
    uid = get_jwt_identity()
    user = User.query.get(uid)
    if not user:
        return jsonify({'msg' : 'User not found'}), 404

    data = request.get_json(force=True, silent=True) or {} 

    if 'full_name'  in data: user.full_name  = data['full_name'].strip()
    if 'contact_no' in data: user.contact_no = data['contact_no']
    if 'age'        in data: user.age  = data['age']
    if 'fitness_level'   in data: user.fitness_level = data['fitness_level']
    if 'about_me'  in data: user.about_me = data['about_me']

    if data.get('new_password'):
        if len(data['new_password'])  < 6:
            return jsonify({'msg' : 'New password too short'}), 400
        user.set_password(data['new_password'])

    db.session.commit()
    return jsonify({'msg': 'Profile updated', 'user': user.to_dict()}), 200




