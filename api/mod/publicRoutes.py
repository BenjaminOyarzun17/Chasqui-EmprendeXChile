from mod import app
from flask import request, jsonify, redirect, Response, url_for, send_file
import pyrebase
from functools import wraps
import sys
import os
import json

config = json.loads(os.getenv('CONFIG'))


pb = pyrebase.initialize_app(config)
pbauth = pb.auth()
db = pb.database()
storage = pb.storage()








@app.route("/", methods=["GET"])
@app.route("/index", methods = ["GET"])
def index():
    return {"index":"ok"}


@app.route("/login", methods = ["GET", 'POST'])
def userLogin():
    if request.method == "POST":
        data = request.form.to_dict()
        tipo = data["tipo"]
        email = data["email"]
        password = data["password"]
        try:
            
            credenciales = pbauth.sign_in_with_email_and_password(email,password)
            print(credenciales, file = sys.stdout)
            return {"status":"success",
                    "token":credenciales["idToken"],
                    "tipo":tipo,
                    "id":credenciales["localId"]
                }

        except Exception as e:
            print(e, file = sys.stdout)
            return {"status":"clave o correo incorrecto"}, 404
        
        
    return {"index":"ok"}




@app.route("/signup", methods = ["GET", "POST"])
def signup():
    if request.method == "GET":
        categorias = db.child("categorias").get().val()
        
        return {
            "categorias":categorias,
            "seccion signup":"ok", 
            "message":'legal'
            }


    if request.method == "POST":
        datos = request.form.to_dict()
        
        email = datos["email"]
        direccion = datos["direccion"]
        comuna = datos["comuna"]
        userName = datos["userName"]
        password = datos["password"]
        nombre = datos["nombre"] 
        edad = datos["edad"]
        
        print(datos, file = sys.stdout)
        try:
            credenciales = pbauth.create_user_with_email_and_password(email, password)
            
        except Exception as e:
            print(e, file = sys.stdout)
            
            return {"status":"error"}, 404
        if datos["tipo"]=="pyme":
           tiposPyme= [datos['tipoPyme']]
           db.child("pymes").child(credenciales["localId"]).set({
               "email":email, 
               "tiposPyme": tiposPyme,
                "nombre":nombre, 
                "userName":userName, 
                "comuna":comuna, 
                "direccion":direccion, 
                "edad":edad, 
                "urlPerfil":"https://firebasestorage.googleapis.com/v0/b/torneo-business.appspot.com/o/files%2FuserIcon.png?alt=media&token=5ed2dde6-655e-409c-a271-24b5ff057255",
                "pedidos":{
                    "dummy":{
                        "delivery":"no", 
                        "direccion":"Calle, Comuna", 
                        

                        "productos":[
                            {
                                "nombre":"Producto", 
                                "valor":100,
                                "estado":"entregado", 
                                "horaPedido":"Hace una hora", 
                                "fechaPedido":"hoy", 
                                "pagado":"sí", 


                            }
                        ], 
                        "receiverName":"Cliente", 
                        
                    }
                },
                "productos":[
                    {
                        "descripcion":"Este es un ejemplo",
                        "fotoDescriptiva":"no",
                        "nombre":"Ejemplo",
                        "nombreImagenPrincipal":"no",
                        "tokenImagen":"no",
                        "valor":0

                    }
                ],
                "servicios":[
                    {
                        "descripcion":"Este es un ejemplo",
                        "duracion":"Duracion del servicio",
                        "fotoDescriptiva":"no",
                        "nombre":"Ejemplo",
                        "nombreImagenPrincipal":"no",
                        "tokenImagen":"no",
                        "valor":0, 
                        "horarios":[
                            {
                            "fecha":"ejemplo",
                            "hora":"ejemplo",
                            "cliente":"--",
                            "direccion":"--",
                            "anotaciones":"--",
                            "disponible":"--",
                            "idCliente":"--"
                            }
                        ]
                    }
                ],
                "stats":{
                    "clientesMes":0, 
                    "clientesSemana":0,
                    "gananciasMes":0,
                    "gananciasSemana":0, 
                    "ranking":"nn", 
                    "ventasMes":0, 
                    "ventasSemana":0
                }
           }, credenciales["idToken"])
           
           return {"status":"success",
                    "token":credenciales["idToken"],
                    "tipo":datos["tipo"], 
                    "id": credenciales["localId"]  
                }

        if datos["tipo"] =="usuario":
           
            db.child("users").child(credenciales["localId"]).set({
               "email":email, 
                "nombre":nombre, 
                "userName":userName, 
                "comuna":comuna, 
                "direccion":direccion, 
                "edad":edad
            }, credenciales["idToken"])
            return {"status":"success", 
                    "token":credenciales["idToken"],
                    "tipo":datos["tipo"], 
                    "id": credenciales["localId"]            
            }
    
    return {"signuproute":"route"}
   


    





