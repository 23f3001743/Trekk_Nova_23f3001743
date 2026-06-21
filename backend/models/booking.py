
# this is the junction table linking app_users and treks

from extensions import db
from datetime import datetime


class Booking(db.Model):
    __tablename__ = 'bookings'

    id = db.Column(db.Integer, primary_key=True)

    trekker_id = db.Column(db.Integer, db.ForeignKey('app_users.id'), nullable=False)
    trek_id    = db.Column(db.Integer, db.ForeignKey('treks.id'), nullable=False)

    booked_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Booked / Cancelled / Completed
    booking_status = db.Column(db.String(20), nullable=False, default='Booked')

    # payment simulation fields
    payment_status = db.Column(db.String(20), default='Pending')   # Pending / Paid
    payment_ref    = db.Column(db.String(100), nullable=True)
    amount_paid    = db.Column(db.Float, default=0.0)

    # prevents double booking
    __table_args__ = (
        db.UniqueConstraint('trekker_id', 'trek_id', name='one_booking_per_trek'),
        {'extend_existing': True}
    )

    def to_dict(self):
        return {
            'id'             : self.id,
            'trekker_id'     : self.trekker_id,
            'trekker_name'   : self.trekker_info.full_name if self.trekker_info else None,
            'trek_id'        : self.trek_id,
            'trek_title'     : self.trek_info.title if self.trek_info else None,
            'trek_region'    : self.trek_info.region if self.trek_info else None,
            'trip_start'     : self.trek_info.trip_start.strftime('%Y-%m-%d') if self.trek_info else None,
            'cost_per_person': self.trek_info.cost_per_person if self.trek_info else None,
            'booked_at'      : self.booked_at.strftime('%Y-%m-%d %H:%M'),
            'booking_status' : self.booking_status,
            'payment_status' : self.payment_status,
            'payment_ref'    : self.payment_ref,
            'amount_paid'    : self.amount_paid
        }
