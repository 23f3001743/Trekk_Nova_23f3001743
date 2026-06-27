import os
from dotenv import load_dotenv
load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY' , 'treknova-secret-2026')

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY' , 'treknova-jwt-2026')
    JWT_ACCESS_TOKEN_EXPIRES = 86400

    SQLALCHEMY_DATABASE_URI = 'sqlite:///trekknova.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    REDIS_URL = 'redis://localhost:6379/0'
    CELERY_BROKER_URL = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'

    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_USERNAME')

    ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL')
