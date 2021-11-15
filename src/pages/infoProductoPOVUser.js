
import { useEffect , useState} from "react";
import React from "react";
import { useLocation, useParams, useHistory } from "react-router";
import { Button } from "react-bootstrap";
import CarouselItemsSimilares from "../components/carouselItemsSimilares";
import axios from 'axios';
import Loading from "../components/loading";

export default function InfoProductoPOVUser(){

    const location = useLocation();
    const [infoPyme, setInfoPyme] = useState({});
    const [similares, setSimilares] = useState({});
    const history = useHistory();
    const [datos, setDatos] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    let p = useParams();

    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }





    
    async function agregarAlCarrito (){
        const res = await axios({
            method:"POST",
            url:location.pathname, 
            headers:{
                "authorization":sessionStorage.getItem("token"),
                "userId":sessionStorage.getItem("userId"), 
                "ownerpyme":p.idPyme
            }, 
            data:{
                datos
            }
        })
        .then(resp =>{
            console.log(resp);
            if (resp.data.status=="success"){
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }



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
                  setDatos(result.datos)  ;
                  setInfoPyme(result.infoPyme)  ;
                  setSimilares(result.similares)
                  
                  setIsLoaded(true);

              }

            }
          )
      }, []);
    if(isLoaded){
        console.log(datos);
        console.log(p.idPyme);

        return(
            <div id="contenedorPrincipalPOVUser">
                <div id="gridPrincipalPOVUser">
                    <div id="datosProductoPOVUser">
                        <div id="contenedorTarjetaProductoPOVUser">
                            <div id="contenedorImagenProductoPOVUser">
                            
                                <img id="imagenProductoPOVUser" src={datos.urlImagen}></img>

                            </div>
                            <div id="contenedorDatosEspecificosProductoPOVUser">
                                
                                <div id="contenedorTextoInformativoProductoPOVUser">
                                    <h3>
                                        {datos.nombre}

                                    </h3>
                                    <p>
                                        {datos.descripcion}
                                    </p>
                                    <p>
                                        ${nwc(datos.valor)}
                                    </p>
                                        <Button onClick={()=>agregarAlCarrito()}>Agregar al carrito</Button>
                                </div>
                            </div>
                        </div>
                        <div id="contenedorProductosSimilaresProductoPOVUser">
                            <h4>
                            Productos similares
                            </h4>
                            <hr className="hrEspecialSubHeader"></hr>
                            {
                                
                                <CarouselItemsSimilares
                                similares = {similares["similares"]}
                            >

                            </CarouselItemsSimilares>
                                
                            }
                            
                            
                            
                            
                        </div>
                        
                        
                        
                        
                       
    
                    </div>
                    <div id="datosPymePOVUser">
                        <h4>Ofrecido por: {infoPyme.nombre}</h4>
                        
                        
                        <img id="imagenPymePOVUser" src={infoPyme.urlPerfil}></img>
                        <p style={{textAlign:"justify"}}>
                        {infoPyme.descripcion}

                        </p>                        
                        <Button
                        onClick={
                            ()=>{
                                history.push("/usuario/"+sessionStorage.getItem("userId")+"/mensajes/"+p.idPyme)
                            }
                        }
                        >Chatear</Button>
                        <Button style={{marginLeft:"10px"}}
                        onClick={()=>{
                            history.push("/usuario/"+sessionStorage.getItem("userId")+"/perfil/"+p.idPyme)
                        }}
                        
                        >Perfil</Button>
                        <div>
                        <hr ></hr>
                        <h5>Ubicación pyme</h5>

                       <div className="iframe-rwd">


                       <iframe id="contenedorMapaPOVUser" 
                        
                        width="600" height="450" frameborder="0" 
                        src={`https://maps.google.com/maps?q=${infoPyme.direccion}&t=&z=15&ie=UTF8&iwloc=&output=embed`} >
                        </iframe>
                       </div>
                       
                        </div>
                        
                       
                       
                            
                       
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