from mod import app, check_token
from flask import request, jsonify, redirect, Response, url_for, send_file
import sys
from functools import wraps
from mod import check_token, pb, pbauth,db,storage
import math
import datetime



pusuarios = "users/"
path_product_image="/productos/imagenes"
path_service_image="/servicios/imagenes"
path_pyme_perfil="/perfil"



@app.route("/busquedaNavegacion", methods=["GET", "POST"])
@check_token
def busquedaNavegacoin():
    if request.method =="GET":
        categorias = db.child("categorias").get().val()
        return{
            "categorias":categorias,
            "message":"legal"
        }
    if request.method == "POST":
        q = request.form.to_dict()
        print(q, file = sys.stdout)
        
        categoriaZiel = q["categoria"]
        tipo = q["tipo"]
        result = []
        items = None
        if tipo =="productos":
            items = db.child("productos").get().val()
            print("buscando productos", file = sys.stdout)
        if tipo == "servicios":
            items = db.child("servicios").get().val()
        
            print("buscando servicios", file = sys.stdout)
        
        
        for item in items.keys(): 
            
            if "categorias"  not in items[item].keys():
                print(item)
            else:
                if categoriaZiel in items[item]["categorias"]:
                    result.append(items[item])
        if len(result)==0:
            result = "no se encontraron resultados"
        
        return {
            "resultadosBusqueda":result,
            "message":"legal",
            "tipo":tipo,
            "status":"success"
        }

    




@app.route("/usuario/<idUser>/mensajes", methods = ["GET", "POST"])
@check_token
def chatsUsuario(idUser):
    if request.method == "GET":
        result = db.child("users").child(idUser).child("chats").get().val()
        
        if result ==None:
            return {
                "datos":"no hay chats", 
                "message":"legal"
            }
        else:
            for chat in result.keys():
                result[chat]['nombre']=db.child("pymes").child(chat).child("nombre").get().val()
                result[chat]['urlPerfil']=db.child("pymes").child(chat).child("urlPerfil").get().val()
                result[chat]['idR']=chat




            return{
                "datos":result, 
                "message":"legal"
            }


   



@app.route("/usuario/<idUser>/mensajes/<idR>", methods = ["GET", "POST"])
@check_token
def chatX(idUser, idR):
    if request.method=='GET':
        mensajesPyme = db.child("pymes").child(idR).child("chats").child(idUser).child("mensajes").get().val()
        
        mensajesUser = db.child("users").child(idUser).child('chats').child(idR).child("mensajes").get().val()
        if mensajesPyme ==None or mensajesUser ==None:
            return{
            "message":"legal", 
            "datos":"no hay chats con esta pyme"
            }
        else:

            todos = []
            for fecha in mensajesPyme.keys():
                todos.append(
                    {
                        'content':mensajesPyme[fecha]['content'],
                        'fecha':datetime.datetime.strptime(fecha, "%Y:%m:%d,%a:%H:%M:%S:%f"),
                        "from":'receiver'
                    }
                )
            for fecha in mensajesUser.keys():
                todos.append(
                    {
                        'content':mensajesUser[fecha]['content'],
                        'fecha':datetime.datetime.strptime(fecha, "%Y:%m:%d,%a:%H:%M:%S:%f"),
                        "from":'me'
                    }
                )
            ordenados = sorted(todos, key = lambda d:d["fecha"])
            print(ordenados, file = sys.stdout)
            nombreR = db.child('pymes').child(idR).child('nombre').get().val()
            direccionReceiver = db.child('pymes').child(idR).child('direccion').get().val()



            return{
                "message":"legal", 
                "mensajes":ordenados, 
                "userId":idR, 
                "userName":nombreR,
                "direccionReceiver":direccionReceiver
            }

    if request.method =='POST':
        datos = request.form.to_dict()
        time = datetime.datetime.now().strftime("%Y:%m:%d,%a:%H:%M:%S:%f")

        data = {time:{
            "content":datos["content"]
            }
        }
        print(data, file = sys.stdout)
        db.child("users").child(idUser).child('chats').child(idR).child("mensajes").update(data)
        
        mensajesPyme = db.child("pymes").child(idR).child('chats').child(idUser).child("mensajes").get().val()
        if mensajesPyme ==None:
            db.child("pymes").child(idR).child('chats').child(idUser).child("mensajes").update({
                time:{
                    "content":"chat iniciado por usuario"
                }
            })





        return {"status":"success"}

        

    
    





@app.route("/usuario/<idUser>/misReservas", methods = ["GET"])
@check_token
def reservasUser(idUser):
    if request.method == 'GET':
        reservas = db.child('users').child(idUser).child("reservas").get().val()
        if reservas == None:
            return{
            "datos":"fas",
            "message":"legal",
            "status":"no hay reservas"
             }
        else:
            for reserva in reservas:
                reserva["nombrePyme"] = db.child("pymes").child(reserva["idPyme"]).child("nombre").get().val()


            return{
                "datos":reservas,
                "message":"legal",
                "status":"hay reservas"
            }


@app.route("/usuario/<idUser>/misPedidos", methods = ["GET"])
@check_token
def pedidosUser(idUser):
    if request.method == 'GET':
        pedidosUser = db.child('users').child(idUser).child("pedidos").get().val()
        if pedidosUser!=None:

            for productoPedido in pedidosUser:
                productosPedidosPyme = db.child("pymes").child(productoPedido["pymeId"]).child("pedidos").child(idUser).child("productos").get().val()
                for producto in productosPedidosPyme:
                    if producto["nombre"]==productoPedido["nombre"]:
                        productoPedido["estadoPedido"] = producto["estado"]
                        break
            return {
                    "datos":pedidosUser,
                    "message":"legal"
            }
        else:
            return{
                "datos":"no hay pedidos",
                    "message":"legal"
            }


@app.route("/usuario/<idUser>", methods = ["GET"])
@check_token
def dashboardUser(idUser):
   

    if request.method =="GET":
        datos = db.child("users").child(idUser).get().val()
        productos = db.child("productos").get().val()
        servicios = db.child("servicios").get().val()
        categorias = db.child('categorias').get().val()
        count = 0
        longitudCarro = "0"
        try:
            longitudCarro = len(datos["carrito"])
        except KeyError:
            pass
        print(longitudCarro, file  = sys.stdout)

        filtrados  ={
            "productos": {   
            },
            "servicios":{

            }
        }
        for categoria in categorias:
            filtrados["productos"][categoria] = []
            filtrados["servicios"][categoria] = []
            
        for producto in productos.keys():    
            categoriasProducto = []

            if "categorias" not in productos[producto].keys():
                print(producto)

            else:

                categoriasProducto = productos[producto]["categorias"]
                for categoria in categoriasProducto:
                    filtrados["productos"][categoria].append(productos[producto])

        for servicio in servicios.keys():    
            categoriasServicio= []
            if "categorias" not in servicios[servicio].keys():
                print(servicio)
            

            else:
                categoriasServicio = servicios[servicio]["categorias"]

                for categoria in categoriasServicio:
                    
                    filtrados["servicios"][categoria].append(servicios[servicio])
        
            


        for categoria in categorias:
            if filtrados["productos"][categoria]==[]:
                del filtrados['productos'][categoria]

        for categoria in categorias:
            if filtrados["servicios"][categoria]==[]:
                del filtrados['servicios'][categoria]

        
        
        #print(filtrados, file = sys.stdout)
        


        
        
        #print(categorias, file=sys.stdout)
        result = db.child("users").child(idUser).get().val()
        datos["longitudCarrito"] = longitudCarro
        return {
                "datos":datos,
                "categorias":categorias,
                "filtrados":filtrados,
                "message":"legal"
            }



    return {"index":"ok", 
            "usuario":idUser
            }


@app.route("/usuario/<idUser>/descubrirPymes", methods = ["GET"])
@check_token
def descubrirPymes(idUser):
    if request.method=="GET":
        pymes= db.child("pymes").get().val()
        categorias = db.child('categorias').get().val()
        
        filtrados  ={
            
        }
        for categoria in categorias:
            filtrados[categoria] = []
           
        for pyme in pymes.keys():
            try:

                del pymes[pyme]['stats']
            except Exception as E:
                pass
            try:
                del pymes[pyme]['productos']
            except Exception as e:
                pass
            try:
                del pymes[pyme]['servicios']
                del pymes[pyme]['pedidos']
            except Exception as e:
                pass
            
            
            del pymes[pyme]['edad']


    
        for pyme in pymes.keys():    
            categoriasPyme = []
            pymes[pyme]['idPyme']=pyme

            if "tiposPyme" not in pymes[pyme].keys():
                print(pyme)

            else:
                categoriasPyme = pymes[pyme]["tiposPyme"]
                for categoria in categoriasPyme:
                    filtrados[categoria].append(pymes[pyme])

        vacios = []
        for i in filtrados.keys():
            if len(filtrados[i])==0:
                vacios.append(i)
        for i in vacios:
            del filtrados[i]




        return{
            "sorteados": filtrados,
             "message":"legal"

        }












@app.route("/usuario/<idUser>/perfil/<idPyme>", methods = ["GET"])
@check_token
def perfilPymePublico(idUser, idPyme):
    if request.method=="GET":
        datos = db.child('pymes').child(idPyme).get().val()
        try:
            del datos['pedidos']
        except KeyError:
            pass
        del datos['stats']
        del datos['edad']
        del datos['email']
        
        if "productos" in datos.keys():
        
            if (len(datos["productos"])==1 and datos["productos"][0]["nombre"]=="Ejemplo"):
                del datos["productos"]
            else:
                

                for producto in datos["productos"]:
                    producto["urlImagen"] = storage.child(pusuarios+idPyme+path_product_image).child(producto["nombreImagenPrincipal"]).get_url(producto["tokenImagen"])
        


        if "servicios" in datos.keys():
            if (len(datos["servicios"])==1 and datos["servicios"][0]["nombre"]=="Ejemplo"):
                del datos["servicios"]
            else:
                for servicio in datos["servicios"]:
                    servicio["urlImagen"] = storage.child(pusuarios+idPyme+path_service_image).child(servicio["nombreImagenPrincipal"]).get_url(servicio["tokenImagen"])
        

        return {
                "datos":datos,
                
                "message":"legal"
            }
   







@app.route("/usuario/<idUser>/buscarPymes", methods = ["GET", "POST"])
@app.route("/usuario/<idUser>/buscarPymes/<idPyme>", methods = ["GET", "POST"])
@check_token
def buscarPymes(idUser, idPyme):
    return {"jj":"jj"}




@app.route("/usuario/<idUser>/misPedidos", methods = ["GET", "POST"])
@check_token
def misPedidos():
    return {"jj":"jj"}




@app.route("/usuario/<idUser>/carrito", methods = ["GET", "POST", "DELETE"])
@check_token
def carrito(idUser):
    if request.method == "GET":
        carro = db.child("users").child(idUser).child("carrito").get().val()
        
        
        if carro == None:
            return {
            "message":"legal",
            "status":"no hay productos en el carrito"
        }
        else:
            total = 0
            for item in carro:
                total += int(item["valor"])
            impuestoChasqui = math.ceil((3/100)*total)
            total+= impuestoChasqui
            return{
                "message":"legal",
                "total":total,
                "impuestoChasqui":impuestoChasqui,
                "status":"hay productos en el carrito", 
                "carrito":carro
            }
    if request.method == "DELETE":
        datosD = request.get_json()
        carroOld = db.child("users").child(idUser).child("carrito").get().val()
        carroNew = []
        count = 0
        for i in range(len(carroOld)):
            if i != datosD["index"]:
                carroNew.append(carroOld[i])
        
        db.child("users").child(idUser).child("carrito").set(carroNew)

        return{
            "message":"legal", 
            "status":"success"
        }
    if request.method == "POST":
        fecha = datetime.datetime.now().strftime("%m/%d")
        hora = datetime.datetime.now().strftime("%H:%M:%S")
       

        
        datos = request.get_json()
        usuario = db.child("users").child(idUser).get().val()

        productos = datos["productos"]
        for producto in productos:
            
            todoslosPedidosPyme = db.child("pymes").child(producto["pymeId"]).child("pedidos").get().val()
            if todoslosPedidosPyme!=None and "dummy"in todoslosPedidosPyme.keys():
                
                db.child("pymes").child(producto["pymeId"]).child("pedidos").child("dummy").set([])

            pedidosPyme = db.child("pymes").child(producto["pymeId"]).child("pedidos").child(idUser).get().val()
            
            if (pedidosPyme==None):
                pedidosPyme = {
                    "delivery":"Raptz Express",
                    "direccion": usuario["direccion"],
                    "receiverName":usuario["userName"],
                    "productos":[]
                }
                pedidosPyme["productos"].append(
                    {
                        "nombre":producto["nombre"],
                        "valor":producto["valor"], 
                        "estado":"no entregado", 
                        "horaPedido" : hora,
                        "fechaPedido" : fecha,
                        "pagado":"sí"
                    }
                )
                db.child("pymes").child(producto["pymeId"]).child("pedidos").child(idUser).set(pedidosPyme)

            else:
                
                
                
                pedidosPyme["productos"].append(
                    {
                        "nombre":producto["nombre"],
                        "valor":producto["valor"], 
                        "estado":"no entregado", 
                        "horaPedido" : hora,
                        "fechaPedido" : fecha,
                        "pagado":"sí"
                    }

                )
                db.child("pymes").child(producto["pymeId"]).child("pedidos").child(idUser).set(pedidosPyme)
            statsPyme = db.child("pymes").child(producto["pymeId"]).child("stats").get().val()
            if statsPyme ==None:
                statsPyme={
                    "clientesMes":1,
                    "clientesSemana":1,
                    "gananciasMes":producto['valor'],
                    "gananciasSemana":producto['valor'],
                    "historico":{
                        "11m":{
                            "s2":{
                                "clientes":1,
                                "ganancias":producto['valor']
                                }
                            }
                        }
                    }
                db.child("pymes").child(producto["pymeId"]).child("stats").set(statsPyme)

                
            else:
                statsPyme["clientesMes"]=  int(statsPyme["clientesMes"])+1
                statsPyme["clientesSemana"]=  int(statsPyme["clientesSemana"])+1
                statsPyme["gananciasMes"]=  int(statsPyme["gananciasMes"])+int(producto['valor'])
                statsPyme["gananciasSemana"]=  int(statsPyme["gananciasSemana"])+int(producto['valor'])
                try:
                    statsPyme["historico"]["11m"]["s2"]["clientes"] = int(statsPyme["historico"]["11m"]["s2"]["clientes"]) +1
                except KeyError:
                    statsPyme["historico"]={
                        "11m":{
                            "s2":{
                                "clientes":1
                            }
                        }
                    }
                    

                try:

                    statsPyme["historico"]["11m"]["s2"]["ganancias"] = int(statsPyme["historico"]["11m"]["s2"]["ganancias"]) +int(producto['valor'])
                except KeyError:
                    statsPyme["historico"]["11m"]["s2"]["ganancias"]   =1
                db.child("pymes").child(producto["pymeId"]).child("stats").set(statsPyme)
            pedidosUser = db.child('users').child(idUser).child("pedidos").get().val()
            producto["horaPedido"]=hora
            producto["fechaPedido"]= fecha
            if pedidosUser ==None:
                pedidosUser = [producto]
                db.child('users').child(idUser).child("pedidos").set(pedidosUser)
            
            else:
                pedidosUser.append(producto)
                db.child('users').child(idUser).child("pedidos").set(pedidosUser)
        db.child("users").child(idUser).child("carrito").set([])

        return{
            "message":"legal", 
            "statusPago":"pago realizado con exito",
            "status":"success"
        }


    return {"jj":"jj"}

@app.route("/productos/<idPyme>/<nombreProducto>", methods =["GET", "POST"])
@check_token
def infoProducto(idPyme, nombreProducto):
    if request.method == "GET":
        datos = db.child("pymes").child(idPyme).child("productos").get().val()
        infoPyme=db.child("pymes").child(idPyme).get().val()
        try:
            del infoPyme["pedidos"]
        except KeyError:
            pass
        del infoPyme["productos"]
        #del infoPyme["stats"]["historico"]


        
        ret = {}
        for producto in datos:
            if producto["nombre"] == nombreProducto:
                ret = producto
        linkImagen = storage.child(pusuarios+idPyme+path_product_image).child(ret["nombreImagenPrincipal"]).get_url(ret["tokenImagen"])
        ret["urlImagen"] = linkImagen
        print(ret, file = sys.stdout)


        productos = db.child("productos").get().val()
        
        categoriaObjetivo = ret["categorias"][0]
        

        filtrados  ={
            "similares": []
        }
        
        for producto in productos.keys():    
            categoriasProducto = []

            if "categorias" not in productos[producto].keys():
                print(producto)

            else:
                if categoriaObjetivo in productos[producto]["categorias"]:
                
                    filtrados["similares"].append(productos[producto])

        
        return {
            "message":"legal",
            "infoPyme":infoPyme,
            "similares":filtrados,
            "datos":ret
        }

    if request.method=="POST":
        datos = request.get_json()
        datos = datos["datos"]
        datos["pymeId"]=request.headers["ownerpyme"]
        carroOld = db.child('users').child(request.headers['userId']).child("carrito").child().get().val()
        if carroOld ==None:
            lista = [datos]
            db.child('users').child(request.headers['userId']).child("carrito").set(lista)
        else:
            carroOld.append(datos)
            db.child('users').child(request.headers['userId']).child("carrito").set(carroOld)

        print(datos, file = sys.stdout)
        return{
            'status':"success"
        }






@app.route("/servicios/<idPyme>/<nombreServicio>", methods =["GET", "POST"])
@check_token
def infoServicio(idPyme, nombreServicio):
    if request.method == "GET":
        datos = db.child("pymes").child(idPyme).child("servicios").get().val()
        infoPyme=db.child("pymes").child(idPyme).get().val()
        try:
            del infoPyme["pedidos"]
        except KeyError:
            pass
        del infoPyme["servicios"]
        #del infoPyme["stats"]["historico"]


        
        ret = {}
        for servicio in datos:
            if servicio["nombre"] == nombreServicio:
                ret = servicio
        linkImagen = storage.child(pusuarios+idPyme+path_service_image).child(ret["nombreImagenPrincipal"]).get_url(ret["tokenImagen"])
        ret["urlImagen"] = linkImagen
        ret["impuestoChasqui"] = math.ceil((5/100)*int(ret['valor']))
        ret["valorTotal"] = int(ret["impuestoChasqui"]) + int(ret['valor'])


        print(ret, file = sys.stdout)


        servicios = db.child("servicios").get().val()
        categoriaObjetivo = ret["categorias"][0]

        filtrados  ={
            "similares": []
        }
        
        for servicio in servicios.keys():    
            categoriasProducto = []

            if "categorias" not in servicios[servicio].keys():
                print(servicio)

            else:
                if categoriaObjetivo in servicios[servicio]["categorias"]:
                
                    filtrados["similares"].append(servicios[servicio])

        
        return {
            "message":"legal",
            "infoPyme":infoPyme,
            "similares":filtrados,
            "datos":ret
        }
        
        

    if request.method =="POST":
        datos = request.get_json()
        print(datos, file = sys.stdout)
        
        usuario = db.child("users").child(datos["idUser"]).get().val()
        serviciosPyme = db.child("pymes").child(idPyme).child("servicios").get().val()
        for servicio in serviciosPyme:
            if servicio['nombre'] ==nombreServicio:
                for horario in servicio['horarios']:
                    if horario["fecha"]==datos["fecha"] and horario["hora"]==datos["hora"]:
                        horario["cliente"] = usuario["nombre"]
                        horario["direccion"]= usuario["direccion"]
                        horario["disponible"]=False
                        horario["idCliente"]= datos["idUser"]

        db.child("pymes").child(idPyme).child("servicios").set(serviciosPyme)

        reservasUsuario = db.child('users').child(datos["idUser"]).child("reservas").get().val()
        if reservasUsuario ==None:
            reservasUsuario = []
            reservasUsuario.append({
                "nombreServicio":nombreServicio, 
                "hora":datos["hora"],
                "fecha":datos["fecha"],
                "idPyme":idPyme

            })
            db.child('users').child(datos["idUser"]).child("reservas").set(reservasUsuario)
        else:
            reservasUsuario.append({
                "nombreServicio":nombreServicio, 
                "hora":datos["hora"],
                "fecha":datos["fecha"],
                "idPyme":idPyme
            })
            db.child('users').child(datos["idUser"]).child("reservas").set(reservasUsuario)
        
        return {
            "message":"legal",
            "estadoReserva":"reservado"
        }

        
        


@app.route("/usuario/<idUser>/account", methods = ["GET", "DELETE","POST"])
@check_token
def accountUser():
    return {"bb":"bb"}



