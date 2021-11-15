
import React from "react";
import { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Carousel, Button } from "react-bootstrap";


export default function CarouselItemsSimilares(props){
    const history = useHistory();
    const location = useLocation();
    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function generadorCarousel(lista, tipoItem){
        let n = lista.length;



        let k = lista.slice(0,1);
        let listaMod5 = []
        for (let it = 0 ; it<Math.floor(n/4); it++ ){
            listaMod5.push(lista.slice(it, it+4));
        }
        listaMod5.push(lista.slice(Math.floor(n/4)*4, n));


        
        return(
        
            
            <Carousel slide={false} interval={100000000}>
                {
                    listaMod5.map((quinteto, i)=>{
                        return(
                            <Carousel.Item key = {i}>  
                                <div className="contenedorProductosServiciosDU">
                                    
                                    {
                                        quinteto.map((item, j)=>{
                                            return(
                                        <div className="contenedorProductoServicioDUSimilares" key ={j}>
                                            <img className="imagenPreviewDU" src={item.urlImagen}></img>
                                            <p>
                                            {item.nombre}

                                            </p>
                                            <p>
                                            ${nwc(item.valor)}

                                            </p>
                                            <div>
                                                <Button onClick={()=>{
                                                    history.push("/"+tipoItem+"/"+item.pymeId+"/"+item.nombre)
                                                    window.location.reload();
                                                    
                                                    
                                                }}>
                                                    
                                                    
                                                    Mas
                                                </Button>
                                            </div>

                                        </div>
                                        )})
                                    }
                                </div>

                            </Carousel.Item>
                            
                        )
                    })
                }

            </Carousel>
   
            
        )
        

    }


    
    return(
        
        <div>
            {
            (props.similares!=undefined )? generadorCarousel(props.similares,"productos"):null
            }

        </div>
    )




}