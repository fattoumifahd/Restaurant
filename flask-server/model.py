from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime



db = SQLAlchemy()


class Users(db.Model):
    user_id = db.Column(db.Integer, primary_key=True , autoincrement=True)
    nom = db.Column(db.String(50))
    prenom = db.Column(db.String(50))
    email = db.Column(db.String(100) , unique=True)
    password = db.Column(db.String(100))
    telephone = db.Column(db.String(13))
    mail_verification = db.Column(db.Boolean , default=False)  
    timestamp = db.Column(db.DateTime , default = datetime.now)
    reservations = db.relationship('Reservations', backref='Users', lazy=True)
    orders = db.relationship('Orders', backref='Users', lazy=True)
    def __init__(self, nom , prenom , email , password , tele) -> None:
        self.nom = nom
        self.prenom = prenom
        self.email = email
        self.password = password
        self.telephone = tele
        
    
class Orders(db.Model): 
    order_id = db.Column(db.Integer , primary_key = True , autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    prix_total = db.Column(db.Float ,nullable=False)
    order_date = db.Column(db.DateTime , default = datetime.now)
    payer = db.Column(db.Boolean , default= 0 , nullable = False)
    order_item_id = db.relationship("OrderItem" , backref="Orders", lazy = True)
    reservation = db.relationship("Reservations" , backref ="Orders" , lazy= True)
    # timestamp = db.Column(db.DateTime , default = datetime.now)
    
    

class Reservations(db.Model):
    id = db.Column(db.Integer , primary_key = True , autoincrement= True , nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id') , nullable=True)
    user_id = db.Column(db.Integer , db.ForeignKey('users.user_id'), nullable=False)
    compus_id = db.Column(db.Integer , db.ForeignKey('compus.compus_id'))
    invite = db.Column(db.Integer , nullable = True)
    payment = db.Column(db.Boolean , nullable=False , default=0)
    timestamp = db.Column(db.DateTime , default = datetime.now)
    

class MenuItems(db.Model):
    item_id = db.Column(db.Integer , primary_key = True , autoincrement=True)
    nom = db.Column(db.String(40), nullable = False)
    description = db.Column(db.String(100), nullable=False)
    prix = db.Column(db.Float , nullable = False)
    categorie = db.Column(db.String(50) , nullable= False)
    image = db.Column(db.String(100) , nullable = False)
    order_item_id = db.relationship("OrderItem" , backref="MenuItems", lazy=True)
    def __init__(self, nom, description, prix, categorie, image):
        self.nom = nom 
        self.description = description 
        self.prix = prix 
        self.categorie = categorie 
        self.image = image 
    
    
class OrderItem(db.Model):
    order_item_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.order_id'), nullable=False)
    item_id = db.Column(db.Integer, db.ForeignKey('menu_items.item_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False) 
    
class Compus(db.Model):
    compus_id = db.Column(db.Integer, primary_key=True , autoincrement=True, nullable=False)
    place = db.Column(db.Text(200) , nullable=False)
    telephone = db.Column(db.String(14))    
    ville = db.Column(db.String(50) , nullable=False)
    reservation = db.relationship("Reservations" , backref="Compus" , lazy=True)
    admin = db.relationship("Admin" , backref="Compus" , lazy=True)

class Admin(db.Model):
    admin_id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    nom = db.Column(db.String(50), nullable = False)
    compus_id = db.Column(db.Integer , db.ForeignKey('compus.compus_id') , nullable=False)
    login = db.Column(db.String(100) , nullable=False)
    password = db.Column(db.String(100) , nullable=False)
    timestamp = db.Column(db.DateTime , default = datetime.now)
    
    
    
    
    

