# Central user model for admin, staff, and trekkers that Handles authentication, profile data, and role-based access
# Linked to bookings and trek assignments through relationships

from extensions import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'app_users'

    id  = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(130), unique=True, nullable=False)

    password_hash = db.Column(db.String(255), nullable=False)
    contact_no = db.Column(db.String(15), nullable=True)


    role = db.Column(db.String(20), nullable=False, default='trekker')

    is_active  = db.Column(db.Boolean, default=True)
    is_banned = db.Column(db.Boolean, default=False)

    age = db.Column(db.Integer, nullable = True)
    fitness_level = db.Column(db.String(50), nullable=True)
    experience     = db.Column(db.String(50), nullable=True)
    specialization = db.Column(db.String(100), nullable=True)
    about_me = db.Column(db.Text, nullable= True)


    joined_on = db.Column(db.DateTime, default = datetime.utcnow)


    my_bookings = db.relationship(
        'Booking',
        backref='trekker_info',
        lazy=True,
        foreign_keys='Booking.trekker_id'
    )

    
    handled_treks = db.relationship(
        'Trek',
        backref='guide_info',
        lazy=True,
        foreign_keys='Trek.guide_id'
    )


    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def verify_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def is_admin(self):
        return self.role == 'admin'

    def is_guide(self):
        return self.role == 'staff'

    def is_trekker(self):
        return self.role == 'trekker'

    def to_dict(self):
        return{
            'id'            : self.id,
            'full_name'     : self.full_name,
            'email'         : self.email,
            'contact_no'    : self.contact_no,
            'role'          : self.role,
            'is_active'     : self.is_active,
            'is_banned'     : self.is_banned,
            'age'           : self.age,
            'fitness_level' : self.fitness_level,
            'experience'     : self.experience,
            'specialization' : self.specialization,
            'about_me'      : self.about_me,
            'joined_on'     : self.joined_on.strftime('%Y-%m-%d')
        }  
