
import React,{useState, useEffect} from 'react'

import {Link, Redirect, useHistory} from 'react-router-dom';
//import centrada from '../images/centrada.jpg';
//import centrada from '../images/centrada.jpeg';
import centrada from '../images/centradav2.jpeg';

import { useLocation } from 'react-router';
import iconoUsuario from '../images/iconoUsuario.png';

import BusquedaNavegacion from './busquedaNavegacion';
export default function Navegacion(){
    
    const [datosUsuario, setDatosUsuario] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [lC, setLC] = useState("0");
    let token = sessionStorage.getItem('token');
    let history = useHistory();
    

    function cerrarSesion (){
        sessionStorage.clear();
        setDatosUsuario({});
        history.push("/");
        window.location.reload();
    }
    useEffect(() => {
        if(token===undefined || token==null ||token===""){
            console.log("no token");
        }else{
            fetch("/"+sessionStorage.getItem('tipo')+"/"+sessionStorage.getItem('userId'), {
                method:"GET", 
                headers:{
                    "authorization": sessionStorage.getItem("token"), 
                    
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
                      setIsLoaded("true")
                      setDatosUsuario(result.datos);
                      
                  }
    
                }
              )
        }
        
        
        
      }, [])

      if (token===undefined || token==null ||token===""){
        return(
            <div className="contenedorAmbasNavegacion">
                <div  className = "contenedorNavegacion">
                    
                <span id="spanEspecial">
                        
                        CHASQUI
                   
                         </span>
                    
                        
                    
                    <BusquedaNavegacion></BusquedaNavegacion>
                    
                    <div className="itemNavegacion" >
                        <img className="imagenLogoNavegacion" src={centrada}/>
    
                    </div>
                
                </div>
                <div className = "contenedorNavegacion">
                    <div className="itemNavegacionInferior">
                        <Link 
                        className="linkNegroNavegacion"
                        to = "/">
                        Inicio
                        </Link>
                    </div>
                    <div className="itemNavegacionInferior">
                        <Link 
                        
                        className="linkNegroNavegacion"
                        to = "/login">
                        Iniciar sesión
    
                        </Link>
                    </div>
                    <div className="itemNavegacionInferior">
                        <Link 
                        className="linkNegroNavegacion"
                        to = "/signup">
                        Registrarse
                        </Link>
                    </div>
                  
                    <div 
                    className="linkNegroNavegacion"
                    className="itemNavegacionInferior">
                        Sobre Chasqui
                    </div>
    
                </div>
            </div>
        )
    
    }else if (token!= '' ){
        
        
        
        
        if(sessionStorage.getItem("tipo")=="usuario"){
            
            return(    
                <div className="contenedorAmbasNavegacion">
                        <div  className = "contenedorNavegacion">
                            <div id="contenedorTituloNavegacion" >
                            
                        <span id="spanEspecial">
                        
                        CHASQUI
                   
                         </span>
                            </div >
                            <BusquedaNavegacion></BusquedaNavegacion>
                            
                            <div className="itemNavegacion" >
                                <img className="imagenLogoNavegacion" src={centrada}/>
            
                            </div>
                        
                        </div>
                        <div className = "contenedorNavegacion">
                       
                            
                            <div>
                               
                            </div>
                          
                            <div className="itemNavegacionInferior">
                            
                                <Link
                                className="linkNegroNavegacion"
                                to={"/usuario/"+sessionStorage.getItem("userId")+"/misPedidos"}
                                >
                                Mis pedidos

                                </Link>
                            </div>
                            <div className="itemNavegacionInferior">
                                <Link
                                className="linkNegroNavegacion"
                                to={"/usuario/"+sessionStorage.getItem("userId")+"/descubrirPymes"}
                                >
                                Descubrir Pymes

                                </Link>
                            </div>
                            <div className="itemNavegacionInferior">
                            <Link
                            className="linkNegroNavegacion"
                                to={"/usuario/"+sessionStorage.getItem("userId")+"/carrito"}
                                >
                                Carrito[{datosUsuario.longitudCarrito}]

                                </Link>
                                
                            </div>

                            
                            <div className="itemNavegacionInferior">

                            
                            <div  id = "tarjetaEspecialUsuario" >
                            <div id="contenedorTarjetaUsuarioNavegacion">
                            
                            <div className="dropdown show">
                                <a className="cafeEspecial" className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {datosUsuario.userName}
                                    
                                    

                                </a>
                                
                                
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <Link className="dropdown-item" to={"/usuario/"+sessionStorage.getItem("userId")}>Inicio
                                </Link>
                                <Link className="dropdown-item"  to={"/usuario/"+sessionStorage.getItem("userId")+"/mensajes"}>Chats
                                </Link>
                                <Link className="dropdown-item" to={"/usuario/"+sessionStorage.getItem("userId")+"/misReservas"}>
                                    Reservas
                                </Link>
                               
                                    
                                <a className="dropdown-item" onClick={cerrarSesion}>Cerrar sesión</a>
                                </div>
                             </div>
                                <div>
                                <img className="imagenLogoNavegacion" src={iconoUsuario}/>
                                </div>
                            </div>
                            </div>
                            <div className="contenedorDireccionNavegacion">
                            <b>
                            {datosUsuario.direccion}

                            </b>

                            </div>
                            </div>
                            
                        </div>
                    </div>
                )

        }else if (sessionStorage.getItem("tipo")=="pyme"){
            return(    
                <div className="contenedorAmbasNavegacion">
                        <div  className = "contenedorNavegacion">
                        <span id="spanEspecial">
                        
                        CHASQUI
                   
                         </span>
                            <div id = "contenedorFormaNavegacion" className="itemNavegacion" >
                                <form className="formaNavegacion">
                                    <input className="inputFormaNavegacion" placeholder="A la orden de tu Chasquido"/>
                                    <select className="filtrarFormaNavegacion" name="filtrar" id="cars">
                                        <option value="filtrar">Filtrar</option>
                                        <option value="pymes">Pymes</option>
                                        <option value="servicios">Servicios</option>
                                       
                                    </select>
                                   
                                    <input type="submit" value="Buscar"/>
                                </form>
                            </div>
                            <div className="itemNavegacion" >
                                <img className="imagenLogoNavegacion" src={centrada}/>
            
                            </div>
                        
                        </div>
                        <div className = "contenedorNavegacion">
                       
                          
                            <div className="itemNavegacionInferior">
                                
                                
                                <Link 
                                className="linkNegroNavegacion"
                                to={"/pyme/"+sessionStorage.getItem("userId")+"/pedidos"}>Pedidos</Link>

                            </div>
                            <div className="itemNavegacionInferior">
                                <Link 
                                className="linkNegroNavegacion"
                                to={"/pyme/"+sessionStorage.getItem("userId")+"/administrar"}>Administrar</Link>
                            </div>
                            <div className="itemNavegacionInferior">
                                <Link 
                                className="linkNegroNavegacion"
                                to={"/pyme/"+sessionStorage.getItem("userId")+"/ganancias"}>Mis ganancias</Link>

                            </div>
                            <div className="itemNavegacionInferior">
                                <Link 
                                className="linkNegroNavegacion"
                                to={"/pyme/"+sessionStorage.getItem("userId")+"/mensajes"}>Chats</Link>
                            </div>
                            <div  className="itemNavegacionInferior">
                                <div id="contenedorTarjetaUsuarioNavegacion">
                                
                                    <div className="dropdown show">
                                        <a className="cafeEspecial" className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {datosUsuario.userName}
                                        </a>

                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                        <Link className="dropdown-item" to={"/pyme/"+sessionStorage.getItem("userId")}>Inicio
                                        </Link>
                                            
                                            <a className="dropdown-item" onClick={cerrarSesion}>Cerrar sesión</a>
                                        </div>
                                    </div>
                                    
                                    <img className="imagenLogoNavegacion" src={datosUsuario.urlPerfil}/>
                                    
                                
                                </div>
                            
                                
                            </div>
                            </div>
                            </div>
                            
                       
                    
                )




        }
        
        
        
        
        
          
    } 
    

          




}
    
    

