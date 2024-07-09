# import mysql.connector
from flask import Flask , jsonify , request , session, url_for , template_rendered
from flask_cors import CORS 
from model import Users , OrderItem , MenuItems , Reservations , Orders , Compus ,Admin ,  db
from itsdangerous import URLSafeSerializer , SignatureExpired
from flask_marshmallow import Marshmallow
from datetime import datetime
import redis
from flask_bcrypt import Bcrypt
from flask_session import Session
from flask_mail import Mail , Message
import string
import random
from sqlalchemy.orm import selectinload, joinedload
from flask_uploads import UploadSet , IMAGES , configure_uploads
from flask_wtf import FlaskForm 
from flask_wtf.file import FileAllowed , FileField , FileRequired 
from wtforms import SubmitField
from werkzeug.utils import secure_filename
import os




# # connect to database

# db = mysql.connector.connect (
#     host= "localhost",
#     user= "root",
#     password= "",
#     database= "restaurant"
# )

# cur = db.cursor()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root@localhost/resto'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHRMY_ECHO'] = True
app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://127.0.0.1:6379')

app.config["MAIL_SERVER"] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'fahdfattoumi8@gmail.com'
app.config['MAIL_PASSWORD'] = 'htep xcht svbb yhun'
app.config['MAIL_USE_TL5'] = False
app.config['MAIL_USE_SSL'] = True
app.config['UPLOAD_FOLDER'] = 'static/images'
ALLOWED_EXTENSIONS = set(['png','jpg','jpeg','svg','pjpeg', 'pjp'])
mail = Mail(app)
cors = CORS(app, resources={r"/http://localhost:3000/*": {"origins": "*"}})
app.secret_key = 'secret key'

server_session = Session(app)

s = URLSafeSerializer('secret key')






db.init_app(app)
ma = Marshmallow(app)
app.app_context().push()    
bcrypt = Bcrypt(app)


# session(app)

# users Schema
class userSchema(ma.Schema):
    class Meta:
        fields = ('user_id','nom' , 'prenom' , 'email', 'password')
user_shema = userSchema(many=True)


# Menu_items Schema
class Menu_items_Schema(ma.Schema):
    class Meta:
        fields = ('item_id','nom' , 'description', 'prix' , 'categorie', 'image')
menu_items_shema = Menu_items_Schema(many=True)

#compus Schema 
class Compus_Schema(ma.Schema):
    class Meta:
        fields = ('compus_id','place' , 'telephone', 'ville' )
compus_schema = Compus_Schema(many=True)

class Reservations_Schema(ma.Schema):
    class Meta : 
        fields = ('id', 'order_id', 'user_id', 'compus_id', "invite", "payment")
reservation_shema = Reservations_Schema(many=True)

class Admin_Schema(ma.Schema):
    class Meta:
        fields = ('admin_id', "nom", 'compus_id', 'login', 'password')
admin_schema = Admin_Schema(many=False)

@app.route('/')
def index():
    res = Users.query.all()
    users = user_shema.dump(res)
    return jsonify(users) 


@app.route('/menuItems')
def menuItems():
    res = MenuItems.query.all()
    menu_items = menu_items_shema.dump(res)
    return jsonify(menu_items)


@app.route("/signup", methods=["POST"])
def signup():
    if request.method == "POST":
        data = request.json
        email = data['email']
        hash_password = bcrypt.generate_password_hash(data['password'])
        newUser =  Users(data['nom'], data['prenom'], data['email'] , hash_password, data['tele'])
        db.session.add(newUser)
        db.session.flush()
        # token = s.dumps(email , salt='email-verification')
        mes = Message("EMAIL VERFICATION" , recipients=[email], sender='fahdfattoumi8@gmail.com')
        
        # link = url_for('email_verification' , user_id=newUser.user_id , _external=True)
        # def get_format() :
        #     return f"""{"".format(link)}"""
        try :
            opt = random.randint(000000,999999)
            mes.body= f"Mail verifcation code : {opt} "
            mail.send(mes)
            db.session.commit()
            
        except :
            res = jsonify({"error" : "Error to sending mail"})
            res.status_code = 400
            return res
        # db.session.commit()
        
        return {"messege" : "ok" , "code" : opt , "user_id" : newUser.user_id}
    
@app.route('/email_verification/<user_id>' ,methods=["GET"])
def email_verification(user_id):
    try :
        Users.query.filter_by(user_id=user_id).update({'mail_verification' : 1})
        db.session.commit()
        # print(user.nom)
        res = jsonify({"message" : "email Verified"})
        res.status_code = 200
        return res
    except :
        return {"error" : "error"}
    



@app.route('/users', methods=['GET'])
def users(): 
    if request.method == "GET":
        res = Users.query.all()
        # print(res)
        emails = user_shema.dump(res)
        return emails
        

@app.route('/menuItems/<categorie>', methods=['GET'])
def Menu_Items(categorie):
    if request.method == "GET":
        res = MenuItems.query.filter_by(categorie = categorie)
        items = menu_items_shema.dump(res)
    return items


@app.route('/api/login' , methods=["GET","POST"]) 
def login() :
    if request.method == "GET":
        # print()
        # if session['user']  None :
        try:
            return {'user' : session['user']}
        except KeyError:
            return {'user' : None}
        except:
            return "something get wrong"
        # else :
            # return {'user' : None}
    else: 
        # res = Users.query.filter_by(email = request.json['email'] , password = request.json['password']).one()
        email = request.json['email']
        password = request.json['password']
        user = db.session.query(Users).filter_by(email = email).first()
        # user = user_shema.dump(res)
        print(user)
        if user is  None :
            return {"user" : None}
        elif not bcrypt.check_password_hash(user.password , password):
                return {"user" : None}
        else: 
            user_login = {
                "user_id" : user.user_id,
                "nom": user.nom,
                "prenom": user.prenom,
                "email": user.email,
                "password": user.password,
                "tele": user.telephone
                
            }
            session['user'] = user_login
            return  {"user" : user_login}
        

@app.route('/compus')
def compus():
    res = Compus.query.all()
    compus = compus_schema.dump(res)
    # print(compus)
    return  compus



        
@app.route("/api/logout")
def logout() :
    session.pop('user')
    return {'user' : None}
    

    
@app.route('/add_order' ,methods=['POST'])
def add_order():
    if request.method == "POST":
        data = request.get_json()
        # print(data)
        items = data['basket']
        new_order = Orders(user_id=data['user_id'] , prix_total=data['total'])
        db.session.add(new_order)
        db.session.flush()
        
        
        print(data['quantite'])
        print('-------------\n')
        
        for item in items:
            id = str(item['item_id'])
            new_order_item = OrderItem(order_id=new_order.order_id, item_id = item['item_id'], quantity=data['quantite'][id])
            # print(item['item_id'])
            # print(data['quantite'][id])
            db.session.add(new_order_item)
        
        db.session.commit()
        
        return {'message' : "ok"}
    
    
@app.route('/forget_pass', methods=["POST"])
def forgetPass():
    if request.method == "POST":
        email = request.json['email']
        print(email)
        all_charactere = string.ascii_letters + string.digits + string.punctuation
        new_pass = "".join(random.choices (all_charactere , k = 12))
        print (new_pass)
        new_pass_hash = bcrypt.generate_password_hash(new_pass)
        Users.query.filter_by(email=email).update({"password" : new_pass_hash})
        db.session.commit()
        msg = Message("mot de pass oublie" , recipients=[email] , sender='fahdfattoumi8@gmail.com')
        msg.body = "We regenerate a new password for you \n new password :  {}".format(new_pass)
        mail.send(msg)
        
        
        # msg.body = ""
        return {"message":"ok"}
    
@app.route('/add_reservation/<user_id>' , methods=['POST'])
def reserver(user_id): 
    if request.method == "POST":
        data = request.get_json()
        print(data)
        print(user_id)
        newReservation =  Reservations(user_id=user_id ,compus_id = data['compus_id'] , invite = data['invite'], payment=0)
        db.session.add(newReservation)
        db.session.commit()
        return {"message" : "ok"}
    else :
        print('getMehod')
        
        
@app.route('/myreservations' , methods=['GET'])
def my_reservation():
    user = session['user']
    print(user['user_id'])
    res = Reservations.query.filter_by(user_id = user['user_id'])
    if res is None :
        return {"message" : "aucune Reservation"}
    else :
        resrv = []
        for r in res:
            obj = {
                "reservation_id" : r.id,
                "ville" : r.Compus.ville,
                "place" : r.Compus.place,
                "date" : r.timestamp,
                "invite" : r.invite,
            }
            resrv.append(obj)
        
        return {"reservations" : resrv}
    
    
    
# Admin Routes 

@app.route('/admin/signup' , methods=["POST"])
def admin_signup():
    if request.method == "POST":
        
        data = request.get_json()
        if data['login'] != "" and data['password'] != "" and data['nom'] != "" and data['compus_id'] != "":
            password_hached = bcrypt.generate_password_hash(data['password']) 
            new_admin = Admin(login=data['login'], nom=data['nom'], compus_id=data['compus_id'], password=password_hached )
            db.session.add(new_admin)
            db.session.commit()
            return {"message" : "new admin added"}
        else :
            return {"error" : "tous les champs sont obligatoires"}




@app.route("/admin/login" , methods = ["GET", "POST"])
def admin_login():
    if request.method == "POST":
        data = request.get_json() 
        res = db.session.query(Admin).filter_by(login=data['login']).first()
        admin = admin_schema.dump(res)
        print(admin)
        if admin is None :
            return {"error" : "this Admin not exists"}
        elif not bcrypt.check_password_hash(admin['password'] , data['password']) :
            return {"error" : "password incorrect"}
        else :
            admin_login = admin_schema.dump(admin)
            session['admin'] = admin_login
            return {"message" : "ok", "admin" : admin_login}
    elif request.method == "GET" :
        try:
            return {'admin' : session['admin']}
        except KeyError:
            return {'admin' : None}
        except:
            return "something get wrong"
        
        
        
            
@app.route("/admin/logout")
def Admin_logout() :
    session.pop('admin')
    return {'admin' : None}



@app.route('/admin/reservations' , methods=['GET',"POST"])
def admin_reservations():
    print("GET METHOD")
    if request.method == "GET":
        res = db.session.query(Reservations).all()
        # reservations = reservation_shema.dump(res)
        usr_res = []
        for r in res:
            print(r.Users)
            user = {
                "user_id" : r.user_id,
                "first_name" : r.Users.prenom,
                "last_name" : r.Users.nom,
                "telephone" : r.Users.telephone
            }
            obj = {
                "id" : r.id,
                "order_id" : r.order_id,
                "compus_place": r.Compus.place,
                "compus_id" : r.compus_id,
                "compus_ville" : r.Compus.ville,
                "payer" : r.payment,
                "date" : r.timestamp,
                "user" : user

                
                
            }
            usr_res.append(obj)
        
        return {"Reservations": usr_res}
    else : 
        print ("post method ")




@app.route('/reservations/payment/<id>' , methods=["POST"])
def reservation_payment(id) :
    if request.method == 'POST':
        try :
            Reservations.query.filter_by(id = id).update({"payment" : 1})
            db.session.commit()
            return {"message" : "Reservation payer en success"}
        except :
            return {"message" : "Error"}
        
        
@app.route('/admin/orders' , methods=["POST", "GET"])
def admin_orders():
    if request.method == "GET":
        orders = db.session.query(Orders).all()
        result = []
        for order in orders:
            obj = {
                "order_id": order.order_id,
                "user" : {
                    "nom" : order.Users.nom,
                    "prenom" : order.Users.prenom,
                    "telephone" : order.Users.telephone
                    },
                "order_date" : order.order_date,
                "payer" : order.payer,
                "prix" : order.prix_total
            }
            result.append(obj)
            
        return {"orders" : result}
    

@app.route('/order/payment/<order_id>' , methods=["POST"])
def order_payment(order_id) :
    if request.method == 'POST':
        try :
            Orders.query.filter_by(order_id = order_id ).update({"payer" : 1})
            db.session.commit()
            return {"message": "order payed on success"}
        except : 
            return {"message" : "Error in payment"}
        
        
@app.route('/order_info/<order_id>')
def order_info(order_id) : 
    try : 
        
        order_items = OrderItem.query.filter_by(order_id = order_id).all()
    
        items = []
        for order_item in order_items:
            # for item in order_item:
            menu = {
                "item_id" : order_item.item_id,
                "item_nom": order_item.MenuItems.nom,
                "item_prix" : order_item.MenuItems.prix,
                "quantity" : order_item.quantity
            }
            items.append(menu)
            obj = {
                "order_id" : order_item.order_id,
                "items" : items,
            }    
            

        return {"order_info" : obj}
    except UnboundLocalError:
        return {"message" : "order not found"}
        
        
@app.route('/order_info/<order_id>/<item_id>/delete', methods=["POST"])
def order_item_delete(order_id, item_id):
    if request.method == "POST":
    
        try: 
            OrderItem.query.filter_by(order_id = order_id , item_id=item_id).delete()
            db.session.commit()
            return {"message" : "Item is deleting with success"}
        except :
            return {"message" : "Error in deleting item"}
        
        
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS
@app.route('/admin/add_item', methods=["POST"])
def add_item():
    nom = request.form.get('nom')
    prix = request.form.get('prix')
    description = request.form.get('description')
    categorie = request.form.get('categorie')
    if 'files[]' not in request.files:
        reponse = jsonify({"error" : "Error in uploading file"})
        reponse.status_code = 400
        return reponse
    files = request.files.getlist('files[]')
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print(filename)
            file.save(os.path.join(f'static/images/{categorie}/', filename))
            menu = MenuItems(nom, description , prix ,  categorie, filename )
            try: 
                db.session.add(menu)
                db.session.commit()
                res = jsonify({"message" : "Item added "})
                res.status_code = 200
                return res
            except :
                res = jsonify({"error" : "Error in adding item"})
                res.status_code = 400
                return res
        else : 
            reponse = jsonify({"error" : "File type is not allowed"})
            reponse.status_code = 400
            return reponse
            
    return {"message" : "file successfully uploaded"}
        
    

if __name__ == '__main__':
    app.run(debug=True)
