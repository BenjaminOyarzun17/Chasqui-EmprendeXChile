
import React,{useState, useEffect} from 'react'

import {Link, Redirect, useHistory} from 'react-router-dom';

import { useLocation } from 'react-router';
import { Button } from 'react-bootstrap';
import Loading from 'react-loading';




export default function PedidosUser(){

    const location = useLocation();
   
    const [isLoaded, setIsLoaded] = useState(false);
    const [np, setNp] = useState(false);

    const [datos, setDatos] = useState([]);
    
    const history  = useHistory(); 

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
              
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal" && result.datos!="no hay pedidos"){
                
                setDatos(result.datos);
                setIsLoaded(true);
                
                  
              }else{
                  setNp(true)
              }

            }
          )
      }, []);
      function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


      const mostrarPedidos = datos.map((producto, i)=>{
        return(
            <div className="smallGridItemPedidosUser" key={i}>
                <div className="columnaImagenItemPedidosUser">
                <img className="imagenItemPedidosUser" src={producto.urlImagen}></img>

                </div>
                <div className="columnaDescripcionItemPedidosUser">
                    
                   
                    <h4>
                        {producto.nombre}
                    </h4>
                    <p>
                    {producto.descripcion}

                    </p>
                    <p>
                    Fecha pedido: {producto.fechaPedido}

                    </p>
                    <p>
                    Hora pedido: {producto.horaPedido}

                    </p>

                    <p>
                    Estado pedido: {producto.estadoPedido
                                }

                    </p>
                    <Button 
                    className="margenBoton"
                    onClick ={()=>{
                        history.push("/productos/"+producto.pymeId+"/"+producto.nombre)
                    }}
                    >
                    Más información
                    </Button>
                    <Button 
                    className="margenBoton"
                    onClick ={()=>{
                        history.push("/usuario/"+sessionStorage.getItem("userId")+"/perfil/"+producto.pymeId)
                    }}
                    >
                        Pyme
                    </Button>
                    


               
                    
                </div>
                <div className="columnaValorItemPedidosUser">
                    <h3>
                    ${nwc(producto.valor)}

                    </h3>
                    
                    
                    

                </div>
            </div>
        )


    })
    

    if(isLoaded){
        console.log(datos);
        return(
            <div className='contenedorPrincipalPedidosUsuario' >
                <h3>
                    Mis pedidos actuales
                </h3>
                {mostrarPedidos}
            </div>
        )
    }else if(np){
        return(
            <div>
                No has pedido nada aún... ¿Vamos de compras?
            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }




    



}