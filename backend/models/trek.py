# trek.py stores every trekking package created by admin

from extensions import db
from datetime import datetime


class Trek(db.Model):
    __tablename__ = 'treks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(160), nullable=False)
    region = db.Column(db.String(200), nullable=False)
    overview = db.Column(db.Text, nullable=True)
    cover_image = db.Column(db.String, nullable=True)


    difficulty_level = db.Column(db.String(20), nullable=False, default='Moderate')
    days_required = db.Column(db.Integer, nullable=False)

    capacity = db.Column(db.Integer, nullable=False)
    seats_remaining = db.Column(db.Integer, nullable=False)

    cost_per_person = db.Column(db.Float, nullable=False, default=0.0)

    trip_start = db.Column(db.Date, nullable=False)
    trip_end = db.Column(db.Date, nullable=False)

    current_status = db.Column(db.String(20), nullable=False, default='Open')

    # which staff is handling this trek

    guide_id = db.Column(
        db.integer,
        db.Foreignkey('app_users.id'),
        nullable=True
    )

    listed_on = db.Column(db.DateTime, default=datetime.utcnow)

    trek_bookings = db.relationship('Booking' , backref='trek_info', lazy=True)

    def can_booked(self):
        return self.current_status == 'Open' and self.seats_remaining > 0

    def to_dict(self):
        return {
             'id'             : self.id,
            'title'           : self.title,
            'region'          : self.region,
            'overview'        : self.overview,
            'cover_image'     : self.cover_image,
            'difficulty_level': self.difficulty_level,
            'days_required'   : self.days_required,
            'capacity'        : self.capacity,
            'seats_remaining' : self.seats_remaining,
            'cost_per_person' : self.cost_per_person,
            'trip_start'      : self.trip_start.strftime('%Y-%m-%d'),
            'trip_end'        : self.trip_end.strftime('%Y-%m-%d'),
            'current_status'  : self.current_status,
            'guide_id'        : self.guide_id,
            'guide_name'      : self.guide_info.full_name if self.guide_info else None,
            'listed_on'       : self.listed_on.strftime('%Y-%m-%d')
            
        }
