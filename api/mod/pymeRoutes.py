from mod import app
from flask import json, request, jsonify, redirect, Response, url_for, send_file
from functools import wraps
from mod import check_token, pb, pbauth,db,storage
import os
import sys
import datetime
import pandas
import plotly.express as px
import plotly
import uuid
pusuarios = "users/"
path_product_image="/productos/imagenes"
path_service_image="/servicios/imagenes"
path_pyme_perfil="/perfil"



def numAMes(n):
    n = n[:-1]
    di = {
        "1":"enero",
        "2":"febrero",
        "3":"marzo",
        "4":"abril",
        "5":"mayo",
        "6":"junio",
        "7":"julio",
        "8":"agosto",
        "9":"septiembre",
        "10":"octubre",
        "11":"noviembre",
        "12":"diciembre"
    }
    return (di[str(n)])







@app.route("/pyme/<idPyme>", methods = ["GET"])
@check_token
def dashboardPyme(idPyme):
    if request.method =="GET":
        print(idPyme, file=sys.stdout)
        result = db.child("pymes").child(idPyme).get().val()
        
        
        
       
        
        return {"datos":result,
                "message":"legal"
            }
      

    
    return {"index":"ok"}

@app.route("/pyme/<idPyme>/ganancias")
@check_token
def adminGananciasPyme(idPyme):
    if request.method == "GET":
        datos = db.child("pymes").child(idPyme).child("stats").get().val()
        h = datos["historico"]
        
        dGrandeUtil ={}
        incomeSemanal = []
        clientesSemanal = []
        semanas = []
        for mes in h.keys():
            for semana in h[mes].keys():
                incomeSemanal.append(h[mes][semana]["ganancias"])
                clientesSemanal.append(h[mes][semana]["clientes"])
                semanas.append(semana + "/"+ numAMes(mes))
        
        dGrandeUtil["ganancias"]=incomeSemanal
        dGrandeUtil["clientes"]=clientesSemanal
        dGrandeUtil["semanas"]=semanas

        cpy = dGrandeUtil
        dfGanancias = pandas.DataFrame(dGrandeUtil, columns=["ganancias", "semanas"])
        dfClientes = pandas.DataFrame(cpy, columns = ["clientes", "semanas"])
        
        
        fig = px.line(dfGanancias, x="semanas", y="ganancias", title ="Ganancias por semana", markers=True)
        fig = fig.update_xaxes(rangeslider_visible=True)
        fig.update_layout(width=1500, height=500)
        plot_json = json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
        plot_json = json.loads(plot_json)
        
        
        
        fig2 = px.line(dfClientes, x="semanas", y="clientes", title ="Clientes por semana", markers=True)
        fig2 = fig2.update_xaxes(rangeslider_visible=True)
        fig2.update_layout(width=1500, height=500)
        plotClientes = json.dumps(fig2, cls=plotly.utils.PlotlyJSONEncoder)
        plotClientes = json.loads(plotClientes)
        
        
        
        
        return jsonify({
            "datos":datos, 
            "plot":plot_json,
            "plotClientes":plotClientes,
            "message":"legal"
        })





@app.route("/pyme/<idPyme>/editarDatos", methods = ['GET',"POST"])
@check_token
def editarDatosPyme(idPyme):
    if request.method == "GET":
        categorias =[""]
        categoriasPymes = db.child("categorias").get().val()
        for i in categoriasPymes:
            categorias.append(i)
        return {
            "categorias":categorias, 
            "message":"legal"
        }
    
    
    
    if request.method == "POST":
        datos = request.form.to_dict()
        tiposNuevos =[]
        for i in datos.keys():
            if datos[i] != "" and datos[i]!=None and "tipoPyme" not in i:
                db.child("pymes").child(idPyme).child(i).set(datos[i])
            if "tipoPyme" in i and datos[i]!="" and datos[i]!=None:
                tiposNuevos.append(datos[i])
        if len(tiposNuevos)!=0:
            db.child("pymes").child(idPyme).child("tiposPyme").set(tiposNuevos)
            
        if request.files:
               
                
                for file in request.files.getlist('imagenPerfil'):
                    if file.filename == "":
                        break
                    else:
                        datos["nombreImagenPrincipal"] = request.files["imagenPerfil"].filename
                        file.save(os.path.join(app.config["IMAGE_UPLOADS"],file.filename))
                        datosPut = storage.child(pusuarios+idPyme+path_pyme_perfil+"/"+file.filename).put(app.config["IMAGE_UPLOADS"]+file.filename, request.headers['authorization'] )
                        
                        downloadToken =datosPut["downloadTokens"]
                        urlImagen = storage.child(pusuarios+idPyme+path_pyme_perfil).child(request.files["imagenPerfil"].filename).get_url(downloadToken)
                        db.child('pymes').child(idPyme).child('urlPerfil').set(urlImagen)
                        os.remove(app.config["IMAGE_UPLOADS"]+file.filename)


        return jsonify({
            "status":"done", 
            
            "message":"legal"
        })






@app.route("/pyme/<idPyme>/administrar", methods = ["GET", "POST", "DELETE"])
@app.route("/pyme/<idPyme>/administrar/servicios", methods = ["GET", "POST", "DELETE"])
@check_token
def adminPymeServicios(idPyme):
    if request.method == "GET":
        datos = db.child("pymes").child(idPyme).child("servicios").get().val()
        categoriasPymes = db.child("categorias").get().val()
        
        
        print(datos, file = sys.stdout)
        if datos != None:
            for i in datos:
                i["fotoDescriptiva"] = storage.child(pusuarios+idPyme+path_service_image).child(i["nombreImagenPrincipal"]).get_url(i["tokenImagen"])
        else:
            datos = [{"nombre":"no hay productos"}]
        
        return jsonify({
            "datos":datos, 
            "categorias":categoriasPymes,
            "message":"legal"
        })
 
    if request.method == "POST":
        datos = request.form.to_dict()
        nombrePyme= db.child("pymes").child(idPyme).child("nombre").get().val()
        delete = []
        direccionPyme= db.child("pymes").child(idPyme).child("direccion").get().val()

        categorias= []
        for i in datos.keys():
            if "categ" in i and datos[i]!="" and datos[i]!=None:
                categorias.append(datos[i])
                delete.append(i)
        datos["categorias"] = categorias
        for i in delete:
            del datos[i]

        datos["horarios"] =[
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

        servicioPublico = {
            "nombre": datos["nombre"], 
            "pymeId":idPyme,
            "valor":datos['valor'], 
            "pyme": nombrePyme,
            "direccion": direccionPyme,
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
                        ],
            "categorias": categorias


        }
        
        
        if request.files:
               
                
                for file in request.files.getlist('imagenPrincipal'):
                    if file.filename == "":
                        break
                    else:
                        datos["nombreImagenPrincipal"] = request.files["imagenPrincipal"].filename
                        file.save(os.path.join(app.config["IMAGE_UPLOADS"],file.filename))
                        datosPut = storage.child(pusuarios+idPyme+path_service_image+"/"+file.filename).put(app.config["IMAGE_UPLOADS"]+file.filename, request.headers['authorization'] )
                        
                        datos["tokenImagen"] =datosPut["downloadTokens"]
                        servicioPublico["tokenImagen"] =datosPut["downloadTokens"]
                        servicioPublico['urlImagen'] = storage.child(pusuarios+idPyme+path_service_image).child(datos["nombreImagenPrincipal"]).get_url(datosPut["downloadTokens"])
                        
                        os.remove(app.config["IMAGE_UPLOADS"]+file.filename)
        old = db.child('pymes').child(idPyme).child("servicios").get().val()
        db.child('servicios').push(servicioPublico)

        if (old != None):
            old.append(datos)
        
            db.child('pymes').child(idPyme).child("servicios").set(old)
        else:
            db.child('pymes').child(idPyme).child("servicios").set([datos])

        return ({"status":"success"})

    if request.method == "DELETE":
        datos = request.get_json()
        index = datos['index']
        old = db.child('pymes').child(idPyme).child("servicios").get().val()
        final = []
        for i in range(len(old)):
            if(i != int(index)):
                final.append(old[i])
        db.child('pymes').child(idPyme).child("servicios").set(final)

        return ({"status":"success"})




            


    return {"ok":"ok"}




@app.route("/pyme/<idPyme>/administrar/calendario", methods = ['POST','DELETE'])
@check_token
def administrarCalendario(idPyme):
    if request.method == 'POST':
        datos = request.form.to_dict()
        horariosActuales = db.child("pymes").child(idPyme).child("servicios").child(datos["idxServicio"]).child("horarios").get().val()
        horariosActuales.append({
            "fecha":datos["fecha"],
            "hora":datos["hora"],
            "cliente":"--",
            "direccion":"--",
            "anotaciones":"--",
            "disponible":True,
            "idCliente":"--"
        })
        db.child("pymes").child(idPyme).child("servicios").child(datos["idxServicio"]).child("horarios").set(horariosActuales)
        print(horariosActuales, file = sys.stdout)
        return ({"status":"success"})

    if request.method =="DELETE":
        datos = request.get_json()
        
        
        horariosActuales = db.child("pymes").child(idPyme).child("servicios").child(datos["idxServicio"]).child("horarios").get().val()
        horariosFiltrados = []
        for i in range(len(horariosActuales)):
            if i != datos["idxHorario"]:
                horariosFiltrados.append(horariosActuales[i])
        db.child("pymes").child(idPyme).child("servicios").child(datos["idxServicio"]).child("horarios").set(horariosFiltrados)

        
        
        return ({"status":"success"})

@app.route("/pyme/<idPyme>/administrar/calendario/agregandoNota", methods = ['POST','DELETE'])
@check_token
def agregarNotaHorarioCalendario(idPyme):
    if request.method == 'POST':
        datos = request.form.to_dict()
        db.child("pymes").child(idPyme).child("servicios").child(datos["indexServicio"]).child("horarios").child(datos["indexHorario"]).child("anotaciones").set(datos["anotaciones"])
        
        return ({"status":"success"})
        
    if request.method == 'DELETE'   :
        datos = request.get_json()
        print(datos, file = sys.stdout)
        db.child("pymes").child(idPyme).child("servicios").child(datos["indexServicio"]).child("horarios").child(datos["indexHorario"]).child("anotaciones").set("--")

        return ({"status":"success"})
        






@app.route("/pyme/<idPyme>/administrar/productos", methods = ["GET", "POST", "DELETE"])
@check_token
def adminPymeProductos(idPyme):
    if request.method == "GET":
        datos = db.child("pymes").child(idPyme).child("productos").get().val()
        categoriasPymes = db.child("categorias").get().val()
        
        print(datos, file = sys.stdout)
        direccionPyme= db.child("pymes").child(idPyme).child("direccion").get().val()
        
        if datos != None:
            for i in datos:
                i["fotoDescriptiva"] = storage.child(pusuarios+idPyme+path_product_image).child(i["nombreImagenPrincipal"]).get_url(i["tokenImagen"])
        else:
            datos = [{"nombre":"no hay productos"}]
        
        return jsonify({
            "datos":datos, 
            "categorias":categoriasPymes,
            "message":"legal"
        })
    if request.method == "POST":
        datos = request.form.to_dict()
        nombrePyme= db.child("pymes").child(idPyme).child("nombre").get().val()
        direccionPyme= db.child("pymes").child(idPyme).child("direccion").get().val()
        delete = []
        categorias= []
        for i in datos.keys():
            if "categ" in i and datos[i]!="" and datos[i]!=None:
                categorias.append(datos[i])
                delete.append(i)
        datos["categorias"] = categorias
        for i in delete:
            del datos[i]
        productoPublico = {
            "nombre": datos["nombre"], 
            "pymeId":idPyme,
            "valor":datos['valor'], 
            "pyme": nombrePyme, 
            "direccion":direccionPyme,
            "categorias": categorias
            }
        
        if request.files:
               
                
                for file in request.files.getlist('imagenPrincipal'):
                    if file.filename == "":
                        break
                    else:
                        datos["nombreImagenPrincipal"] = request.files["imagenPrincipal"].filename
                        file.save(os.path.join(app.config["IMAGE_UPLOADS"],file.filename))
                        datosPut = storage.child(pusuarios+idPyme+path_product_image+"/"+file.filename).put(app.config["IMAGE_UPLOADS"]+file.filename, request.headers['authorization'])
                        datos["tokenImagen"] =datosPut["downloadTokens"]
                        productoPublico["tokenImagen"] =datosPut["downloadTokens"]
                        
                        productoPublico['urlImagen'] = storage.child(pusuarios+idPyme+path_product_image).child(datos["nombreImagenPrincipal"]).get_url(datosPut["downloadTokens"])
                        print(datosPut, file = sys.stdout)
                        os.remove(app.config["IMAGE_UPLOADS"]+file.filename)
        old = db.child('pymes').child(idPyme).child("productos").get().val()
        db.child('productos').push(productoPublico)
        
        if (old != None):
            old.append(datos)
        
            db.child('pymes').child(idPyme).child("productos").set(old)
        else:
            db.child('pymes').child(idPyme).child("productos").set([datos])





        return ({"status":"success"})

   
    if request.method == "DELETE":
        datos = request.get_json()
        index = datos['index']
        old = db.child('pymes').child(idPyme).child("productos").get().val()
        final = []
        for i in range(len(old)):
            if(i != int(index)):
                final.append(old[i])
        db.child('pymes').child(idPyme).child("productos").set(final)

        return ({"status":"success"})






@app.route("/pyme/<idPyme>/pedidos", methods= ["GET", "POST"])
@check_token
def pedidosPyme(idPyme):
    if request.method == "GET":
        datos= db.child("pymes").child(idPyme).child("pedidos").get().val()
        listaDatos = []
        for key in datos.keys():
            datos[key]["receiverId"] = key
            listaDatos.append(datos[key])
        
        sol = {"datos":listaDatos,
                "message":"legal"}
        return jsonify(sol)


@app.route("/pyme/<idPyme>/mensajes", methods = ["GET"])
@check_token
def mensajesPyme(idPyme):
    if request.method =="GET":
        result = db.child("pymes").child(idPyme).child("chats").get().val()
        
        if result ==None:
            return {
                "datos":"no hay chats", 
                "message":"legal"
            }
        else:
            for chat in result.keys():
                result[chat]['nombre']=db.child("users").child(chat).child("nombre").get().val()
                
                result[chat]['idR']=chat




            return{
                "datos":result, 
                "message":"legal"
            }


    
    return {"index":"ok"}
    


@app.route("/pyme/<idPyme>/mensajes/<rId>", methods = ["GET", "POST"])
@check_token
def chatPyme(idPyme, rId):
    if request.method == "GET":
        mensajesPyme = db.child("pymes").child(idPyme).child("chats").child(rId).child("mensajes").get().val()
        
        mensajesUser = db.child("users").child(rId).child('chats').child(idPyme).child("mensajes").get().val()

        todos = []
        for fecha in mensajesPyme.keys():
            todos.append(
                {
                    'content':mensajesPyme[fecha]['content'],
                    'fecha':datetime.datetime.strptime(fecha, "%Y:%m:%d,%a:%H:%M:%S:%f"),
                    "from":'me'
                }
            )
        for fecha in mensajesUser.keys():
            todos.append(
                {
                    'content':mensajesUser[fecha]['content'],
                    'fecha':datetime.datetime.strptime(fecha, "%Y:%m:%d,%a:%H:%M:%S:%f"),
                    "from":'receiver'
                }
            )
        ordenados = sorted(todos, key = lambda d:d["fecha"])
        for o in ordenados:
            print(o["fecha"], file = sys.stdout)
        
        #print(ordenados, file = sys.stdout)
        nombreUsuario = db.child('users').child(rId).child('nombre').get().val()



        return{
            "message":"legal", 
            "mensajes":ordenados, 
            "userId":rId, 
            "userName":nombreUsuario
        }



        
        

        

    if request.method == "POST":
        datos = request.form.to_dict()
        time = datetime.datetime.now().strftime("%Y:%m:%d,%a:%H:%M:%S:%f")

        data = {time:{
            "content":datos["content"]
            }
        }
        print(data, file = sys.stdout)
        db.child("pymes").child(idPyme).child('chats').child(rId).child("mensajes").update(data)
        
        


        return {"status":"success"}


    return {"ok":"OK"}


@app.route("/pyme/<idPyme>/account", methods = ["GET", "DELETE", "POST", "PUT"])
@check_token
def accountPyme():
    return {"so":"si"}

