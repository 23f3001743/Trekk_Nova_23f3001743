
from app import create_app
from celery_app import make_celery
from celery.schedules import crontab


flask_app  = create_app()
celery_app = make_celery(flask_app)
import jobs.bg_tasks

celery_app.conf.beat_schedule = {
    'daily-trek-reminders': {
        'task'    : 'jobs.bg_tasks.send_reminders',
        'schedule': crontab(hour=9, minute=0),
    },
    'monthly-admin-report': {
        'task'    : 'jobs.bg_tasks.send_monthly_report',
        'schedule': crontab(day_of_month=1, hour=8, minute=0),
    },
}
