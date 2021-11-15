
import {useLocation , useHistory, useParams} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';

export default function ItemPerfil(props){

    const history = useHistory();
    const location = useLocation();
    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    let p = useParams();
    const mostrarProductos = props.productos.map(
        (producto, i )=>{
            return(
                <div className="contenedorTarjetaPPP">
                    <div className="gridContenedorTarjetaPPP">
                    
                        <div className="contenedorImagenTarjetaPPP">
                            <img className="imagenPPP" src={producto.urlImagen}>
                            </img>
                        </div>
                        <div className="contenedorTextoTarjetaPPP">
                            <h3>
                                {producto.nombre}
                            </h3>
                            <p>
                                {producto.descripcion}
                            </p>
                            <h4>
                                
                                ${nwc(producto.valor)}
                            </h4>
                            <Button 
                            onClick={()=>{
                                history.push("/productos/"+p.idPyme+"/"+producto.nombre)
                            }}
                            >Más</Button>
                        </div>
                    
                    </div>
                </div>


            )




        }
        )


    return(
        <div >
            { props.productos!=undefined ? mostrarProductos:null}
        </div>




    )




}