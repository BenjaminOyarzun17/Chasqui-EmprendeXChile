
import React from "react";
import { useLocation, useHistory } from "react-router";
import { useEffect, useState } from "react";
import Loading from "react-loading";
import { Carousel, Button } from "react-bootstrap";

export default function ResultadosBusqueda(){
    const history = useHistory();
    const location = useLocation();
    const [resultados, setResultados] =useState({});
    const [isLoaded, setIsLoaded] =useState(false);
    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    useEffect(() => {
       console.log(location.pathname); // result: '/secondpage'
       setResultados(location.state);
       console.log(location.state); // result: 'some_value'
       setIsLoaded(true)
    }, [location]);

    
    function generadorCarousel(lista, tipoItem){
        let n = lista.length;



        let k = lista.slice(0,1);
        let listaMod5 = []
        for (let it = 0 ; it<Math.floor(n/5); it++ ){
            listaMod5.push(lista.slice(it, it+5));
        }
        listaMod5.push(lista.slice(Math.floor(n/5)*5, n));


        console.log(listaMod5);
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
                                        <div className="contenedorProductoServicioDU" key ={j}>
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


    if (isLoaded){
        if (resultados.resultadosBusqueda=="no se encontraron resultados"){
            return(
                <div>No se encontraron resultados</div>
                )
        }else{
            
            
            
            return(
                <div className="contenedorPrincipalResultados">
                    <h3>
                    Resultados búsqueda

                    </h3>
                    
                    {generadorCarousel(resultados.resultadosBusqueda,resultados.tipo)}
                </div>
                )
        }
        
        
    }else{
        return(
            <Loading></Loading>
        )
    }

    
    
    
   


}