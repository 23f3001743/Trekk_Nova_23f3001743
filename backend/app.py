from flask import Flask, render_template
from config import Config
from extensions import db, jwt, mail, init_redis



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)
    init_redis(app)

    from models.user import User
    from models.trek import Trek
    from models.booking import Booking


    from routes.auth_routes import auth_bp
    from routes.admin_routes import admin_bp
    from routes.staff_routes import staff_bp
    from routes.trekker_routes import trekker_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(staff_bp, url_prefix='/api/staff')
    app.register_blueprint(trekker_bp, url_prefix='/api/trekker')

    
    @app.route('/')
    @app.route('/<path:path>')
    def serve_app(path=''):
        return render_template('index.html')

    with app.app_context():
        db.create_all()
        print('Tables ready')
        setup_admin()


    return app


def setup_admin():
    from models.user import User

    existing = User.query.filter_by(role='admin').first()
    if not existing:
        admin = User(
           full_name  = 'TrekkNova Admin',
           email = 'admin@trekknova.com',
           contact_no = '0000000000',
           role = 'admin'
            
        )
        admin.set_password('Trekk@123')
        db.session.add(admin)
        db.session.commit()
        print("Admin created -> admin@trekknova.com / Trekk@123")
    else:
        print('Admin already exists')

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
