
from worker import celery_app

result = celery_app.send_task('jobs.bg_tasks.send_monthly_report')
print(result.status)
