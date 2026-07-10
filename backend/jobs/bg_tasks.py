
import csv
import io
from datetime import datetime, timedelta
from worker import celery_app


@celery_app.task(name='jobs.bg_tasks.send_reminders')
def send_reminders():
   
    from extensions import mail, db
    from models.booking import Booking
    from models.trek    import Trek
    from flask_mail     import Message

    print("sending trek reminders...")

    today     = datetime.utcnow().date()
    in_3_days = today + timedelta(days=3)

    
    upcoming = db.session.query(Booking).join(Trek).filter(
        Trek.trip_start    >= today,
        Trek.trip_start    <= in_3_days,
        Booking.booking_status == 'Booked'
    ).all()

    if not upcoming:
        print("no upcoming bookings found")
        return

    sent_count = 0

    for booking in upcoming:
        person = booking.trekker_info
        trek   = booking.trek_info

        if not person or not person.email:
            continue

        days_left = (trek.trip_start - today).days

        try:
            msg = Message(
                subject    = f"Your trek starts in {days_left} day(s)!",
                recipients = [person.email]
            )

            msg.html = f"""
            <div style="font-family:Arial; max-width:600px; margin:auto;">
                <div style="background:#1B4F72; padding:20px;
                    color:white; text-align:center; border-radius:8px 8px 0 0">
                    <h2>TrekkNova Reminder</h2>
                </div>
                <div style="padding:24px; background:#f4f7fa;
                    border-radius:0 0 8px 8px">
                    <p style="font-size:16px">Hey {person.full_name}!</p>
                    <p>Your upcoming trek is almost here!</p>
                    <div style="background:white; padding:16px;
                        border-radius:8px; margin:16px 0;
                        border-left:4px solid #1B4F72">
                        <b>Trek:</b> {trek.title}<br/>
                        <b>Region:</b> {trek.region}<br/>
                        <b>Start Date:</b> {trek.trip_start}<br/>
                        <b>Duration:</b> {trek.days_required} days<br/>
                        <b>Difficulty:</b> {trek.difficulty_level}<br/>
                        <b>Starts in:</b> {days_left} day(s)
                    </div>
                    <p>Pack well, stay safe and enjoy the trek!</p>
                    <p style="color:#888; font-size:12px">
                        Team TrekkNova
                    </p>
                </div>
            </div>
            """

            mail.send(msg)
            sent_count += 1
            print(f"reminder sent to {person.email}")

        except Exception as e:
            print(f"failed to send to {person.email}: {e}")

    print(f"reminders done. sent: {sent_count}")


@celery_app.task(name='jobs.bg_tasks.send_monthly_report')
def send_monthly_report():
    
    from extensions import mail, db
    from models.booking import Booking
    from models.trek    import Trek
    from models.user    import User
    from flask_mail     import Message
    from flask          import current_app
    from sqlalchemy     import func

    print("generating monthly report...")

    now         = datetime.utcnow()
    month_start = now.replace(day=1, hour=0, minute=0, second=0)
    last_month  = now
    month_name  = now.strftime('%B %Y')

    
    treks_last_month = Trek.query.filter(
        Trek.trip_start >= month_start.date(),
        Trek.trip_start <= last_month.date()
    ).all()

    
    bookings_last_month = Booking.query.filter(
        Booking.booked_at >= month_start,
        Booking.booked_at <= last_month
    ).all()

    completed_count = sum(
        1 for b in bookings_last_month
        if b.booking_status == 'Completed'
    )
    cancelled_count = sum(
        1 for b in bookings_last_month
        if b.booking_status == 'Cancelled'
    )

    
    top = db.session.query(
        Trek.title,
        func.count(Booking.id).label('total')
    ).join(Booking).group_by(Trek.id)\
     .order_by(func.count(Booking.id).desc()).first()

    top_trek = f"{top.title} ({top.total} bookings)" if top else "N/A"

    
    total_revenue = sum(
        b.amount_paid for b in bookings_last_month
        if b.payment_status == 'Paid'
    )

    report_html = f"""
    <html>
    <body style="font-family:Arial; max-width:700px; margin:auto;
        padding:20px">
        <div style="background:#1B4F72; padding:30px; color:white;
            text-align:center; border-radius:8px 8px 0 0">
            <h1>TrekkNova Monthly Report</h1>
            <h3>{month_name}</h3>
        </div>
        <div style="background:#f4f7fa; padding:24px;
            border-radius:0 0 8px 8px">
            <h2>Summary</h2>
            <table style="width:100%; border-collapse:collapse;
                background:white; border-radius:8px">
                <tr style="background:#1B4F72; color:white">
                    <td style="padding:12px">Metric</td>
                    <td style="padding:12px">Value</td>
                </tr>
                <tr>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        Treks Conducted
                    </td>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        <b>{len(treks_last_month)}</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        Total Bookings
                    </td>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        <b>{len(bookings_last_month)}</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        Completed Treks
                    </td>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        <b>{completed_count}</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        Cancelled Bookings
                    </td>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        <b>{cancelled_count}</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        Most Popular Trek
                    </td>
                    <td style="padding:12px; border-bottom:1px solid #eee">
                        <b>{top_trek}</b>
                    </td>
                </tr>
                <tr>
                    <td style="padding:12px">
                        Total Revenue
                    </td>
                    <td style="padding:12px">
                        <b>₹{total_revenue:.2f}</b>
                    </td>
                </tr>
            </table>
            <p style="color:#888; font-size:12px; margin-top:20px;
                text-align:center">
                Generated on {now.strftime('%d %B %Y')} by TrekkNova
            </p>
        </div>
    </body>
    </html>
    """

    try:
        admin_email = current_app.config.get('ADMIN_EMAIL')
        if not admin_email:
            print("ADMIN_EMAIL not set in .env")
            return

        msg = Message(
            subject    = f"TrekkNova Monthly Report - {month_name}",
            recipients = [admin_email]
        )
        msg.html = report_html
        mail.send(msg)
        print(f"monthly report sent to {admin_email}")

    except Exception as e:
        print(f"report sending failed: {e}")



@celery_app.task(name='jobs.bg_tasks.do_csv_export')
def do_csv_export(user_id):
    
    from extensions import mail, db
    from models.booking import Booking
    from models.user    import User
    from flask_mail     import Message

    print(f"exporting csv for user {user_id}")

    user     = User.query.get(user_id)
    if not user:
        print(f"user {user_id} not found")
        return False

    bookings = Booking.query.filter_by(
        trekker_id=user_id
    ).order_by(Booking.booked_at.desc()).all()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        'Booking ID', 'Trek Name', 'Region',
        'Difficulty', 'Start Date', 'End Date',
        'Duration (days)', 'Cost Per Person',
        'Booked On', 'Booking Status',
        'Payment Status', 'Amount Paid'
    ])

    for b in bookings:
        trek = b.trek_info
        writer.writerow([
            b.id,
            trek.title          if trek else '',
            trek.region         if trek else '',
            trek.difficulty_level if trek else '',
            trek.trip_start     if trek else '',
            trek.trip_end       if trek else '',
            trek.days_required  if trek else '',
            trek.cost_per_person if trek else '',
            b.booked_at.strftime('%Y-%m-%d %H:%M'),
            b.booking_status,
            b.payment_status,
            b.amount_paid
        ])

    csv_content = output.getvalue()

    try:
        msg = Message(
            subject    = "Your TrekkNova Booking History",
            recipients = [user.email]
        )
        msg.html = f"""
        <div style="font-family:Arial; padding:24px;
            max-width:600px; margin:auto">
            <div style="background:#1B4F72; padding:20px;
                color:white; text-align:center; border-radius:8px">
                <h2>TrekkNova</h2>
            </div>
            <div style="padding:20px; background:#f4f7fa;
                border-radius:0 0 8px 8px">
                <p>Hi {user.full_name}!</p>
                <p>Your booking history CSV is attached to this email.</p>
                <p>Total records: <b>{len(bookings)}</b></p>
                <br/>
                <p style="color:#888; font-size:12px">Team TrekkNova</p>
            </div>
        </div>
        """
        msg.attach(
            filename     = 'my_trek_history.csv',
            content_type = 'text/csv',
            data         = csv_content
        )

        mail.send(msg)
        print(f"csv sent to {user.email}")
        return True

    except Exception as e:
        print(f"csv export failed: {e}")
        return False
