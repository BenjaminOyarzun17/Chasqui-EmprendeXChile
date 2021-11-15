import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../components/loading';


export default function PedidosPyme(){



    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const { register, handleSubmit} = useForm();   

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("", data[""]);
       
        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                window.location.reload(false);
                //alert("agregado exitosamente")
            }

        })  
    };

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
              if (result.message=="legal"){
                
                setPedidos(result.datos);
                setIsLoaded(true);

                  
              }

            }
          )
      }, []);
    
    
    function status(s){
        if ( s=="enviado"){
            return (
                <th className="fondoAmarilloStatusPedidosPyme columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme" >
                <div className="fondoAmarilloStatusPedidosPyme">
                no entregado
                </div>
                </th>
                )

        }
        if (s=="no entregado")
            return (
                <th className="fondoRojoStatusPedidosPyme columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme" >
                <div className="fondoRojoStatusPedidosPyme">
                no entregado
                </div>
                </th>
                )

        if (s=="entregado"){
            return (
                <th className="fondoVerdeStatusPedidosPyme columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme" >
                <div className="fondoVerdeStatusPedidosPyme">
                entregado
                </div>
                </th>
                )
        }
    }



    const mostrarPedidosCliente = pedidos.map((pedido, i)=>{

        return(
            <tr key={i} >
                
                
                <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme" >
                {pedido.receiverName}
                </th> 
                
                <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                {pedido.direccion}
                </th>
                <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                {pedido.delivery}
                </th>
                <th>
                    <table className="tablaPrincipalPedidosPyme">

                    
                {
                    pedido.productos.map((producto, j)=>{
                        return(
                            
                            <tr key={j}>
                                <table className="tablaPrincipalPedidosPyme">
                                    <tbody>
                                        <tr>
                                            <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                                                {producto.nombre}
                                            </th>
                                            <th>
                                                <table className="tablaPrincipalPedidosPyme">
                                                    <tbody>
                                                        <tr>
                                                            <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                                                                {producto.valor}
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                        {status(producto.estado)}
                                                        </tr>
                                                        <tr>
                                                            <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                                                               {producto.fechaPedido}
                                                                
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                        <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                                                               {producto.horaPedido}
                                                                
                                                            </th>
                                                        </tr>
                                                        <tr>
                                                        <th className="columnaTablaPrincipalPedidosPyme bodyTablaPrincipalPedidosPyme">
                                                                {producto.pagado}
                                                            </th>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </th>
                                        </tr>
                                    </tbody>
                                </table>
                            </tr>
                        )

                    })
                }</table>
                </th>


            </tr>
        )

    })





    if(isLoaded){
        return(
            <div className="contenedorPrincipalPedidosPyme">
                <h3>Pedidos activos</h3>
                
                <table className="tablaPrincipalPedidosPyme">
                    <thead>
                        <tr>
                            <th className="columnaTablaPrincipalPedidosPyme">Cliente</th>
                           
                            <th className="columnaTablaPrincipalPedidosPyme">Dirección</th>

                            <th className="columnaTablaPrincipalPedidosPyme">Delivery</th>
                            <th className="columnaTablaPrincipalPedidosPyme">Productos</th>

                        </tr>
                    </thead>
                    <tbody>
                        {mostrarPedidosCliente}
                    </tbody>
                </table>
                
               
                

               
                
                
            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }


   





}