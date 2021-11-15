

import React from "react";
import { Carousel, Button } from "react-bootstrap";
import { Link ,Redirect, useLocation, useHistory} from "react-router-dom";
export default function DisplayProductos(props){
    
    const location = useLocation();
    const history = useHistory();
    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function generadorCarousel(lista, tipoItem){
        let n = lista.length;



        let k = lista.slice(0,1);
        let listaMod5 = []
        for (let it = 0 ; it<Math.floor(n/5); it++ ){
            listaMod5.push(lista.slice(it, it+5));
        }
        listaMod5.push(lista.slice(Math.floor(n/5)*5, n));


        return(
        
            
            <Carousel variant ="dark" slide={false} interval={100000000}>
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
                                            <div>
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
    
    
   
    
    
    

    const mostrarCategoriasProductos =  Object.keys(props.datos.productos)
    .map(
        (categoria, i)=>{
            return(
                <div key = {i}>
                    <h4>
                    Productos: {categoria}
                    </h4>
                    <hr className="hrEspecialSubHeader"></hr>
                    {generadorCarousel(props.datos.productos[categoria],"productos")}
                    
                    
                </div>
            )

        }
    )

    const mostrarCategoriasServicios =  Object.keys(props.datos.servicios)
    .map(
        (categoria, i)=>{
            return(
                <div key = {i}>
                    <h4>
                    Servicios: {categoria}
                    </h4>
                    {generadorCarousel(props.datos.servicios[categoria],"servicios")}
                    
                </div>
            )

        }
    )
    


    
    


    return(
        <div>
            <h3>Productos nuevos</h3>
            <hr></hr>
            <div>
            </div>
                {mostrarCategoriasProductos}
            <div>
                {mostrarCategoriasServicios}
            </div>

        </div>
    )


}