from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import redis
import json


db = SQLAlchemy()
jwt = JWTManager()
mail= Mail()

redis_client = None


def init_redis(app):
    global redis_client
    try:
        redis_client = redis.from_url(
            app.config.get('REDIS_URL' , 'redis://localhost:6379/0'),
            decode_responses=True
        )

        redis_client.ping()
        print("Redis connected successfully")
    except Exception as e:
        print(f"Redis not available: {e}")
        redis_client = None


def save_to_cache(key, data, seconds=300):
    if redis_client is None:
      return
    try:
        redis_client.setex(key,seconds, json.dumps(data))
    except Exception:
        pass
        

def get_from_cache(key):
    if redis_client is None:
        return None
    try:
        data = redis_client.get(key)
        return json.loads(data) if data else None
    except Exception:
        return None


def clear_cache_pattern(pattern):
    if redis_client is None:
        return
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass
