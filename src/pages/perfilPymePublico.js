import {useLocation ,useParams, useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import ItemPerfil from '../components/itemPerfil';
import Loading from '../components/loading';

export default function PerfilPymePublico(){
    const location = useLocation();
    const history = useHistory();
    let p = useParams();

    const [isLoaded, setIsLoaded] = useState(false);
    const [datos, setDatos] = useState({});

    useEffect(() => {
        fetch(location.pathname, {
            method:"GET", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            }
        })
          .then(res => res.json())
          .then(
            (result) => {
              console.log(result);
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal"){
                  
                  setDatos(result.datos);
                  setIsLoaded(true);

              }

            }
          )
      }, []);

      function resvisarProductos(){
            if(datos.productos!=undefined){
                return(
                    <ItemPerfil
        productos = {datos.productos}

            ></ItemPerfil>
                )
            }
      }
      function revisarServicios(){
        if(datos.servicios!=undefined){
            return(
                <ItemPerfil
                    productos = {datos.servicios}

                ></ItemPerfil>
            )
        }
      }

    if(isLoaded){
        console.log(datos);
        return(
            
            <div id="contenedorPrincipalPPP">
                <div id="gridSuperiorPPP">
                    <div id="columnaImagenPPP">
                        <img  className="imagenPPP"
                        src={datos.urlPerfil}></img>
                    </div>

                    <div id="columnaPresentacionPPP">
                        <h3>
                            {datos.nombre}
                        </h3>
                        <hr className="hrEspecialSubHeader"></hr>
                        <p>
                            {datos.descripcion}
                        </p>
                        <p>
                            Dirección: {datos.direccion}
                        </p>
                        <div>
                        <Button
                        onClick={
                            ()=>{
                                history.push("/usuario/"+sessionStorage.getItem("userId")+"/mensajes/"+p.idPyme)
                            }
                        }
                        >Chatear</Button>
                        </div>
                        
                    </div>
                </div>
                <hr></hr>
                <div id="gridInferiorPPP">
                    <div id="columnaMapaPPP">
                        <h5>Ubicación pyme</h5>
                        <hr className="hrEspecialSubHeader"></hr>

                        <div  className="iframe-rwd">

                        <iframe 
                            
                            
                            src={`https://maps.google.com/maps?q=${datos.direccion}&t=&z=15&ie=UTF8&iwloc=&output=embed`} >
                        </iframe>
                        </div>
                    </div>
                    <div id="columnaProductoPPP">
                        {
                            
                            resvisarProductos()
                            
                        }
                        
                        
                        
                        {
                            revisarServicios()
                        }
                        
                    </div>
                </div>
                
            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }





}