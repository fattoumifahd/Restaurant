from server import ma
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
