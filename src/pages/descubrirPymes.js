import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import axios from 'axios';

import Loading from '../components/loading';

export default function DescubrirPymes(){
    const location = useLocation();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [sorteados, setSorteados] = useState({});

    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
              
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal"){
                
                
                setSorteados(result.sorteados)
                setIsLoaded(true)
                  
                  

              }

            }
          )
      }, []);
    


    const mostrarPymes = Object.keys(sorteados).map(
        (cate, i)=>{
            return(
                <div key={i}>
                    <h3>
                    {cate}
                    </h3>
                    <div className="contenedorPymesSlideDP">
                        {sorteados[cate].map((pyme, j)=>{
                            return(
                            <div className="cartaPymeDP">
                                <div>
                                    <img className="imagenCartaPyme" src={pyme.urlPerfil}></img>
                                </div>
                                <h4>
                                {pyme.nombre}
                                </h4>
                                <p style={{textAlign:"justify"}}>
                                    {pyme.descripcion}
                                </p>
                                <Button 
                                onClick={()=>{
                                    history.push("/usuario/"+sessionStorage.getItem("userId")+"/perfil/"+pyme.idPyme)
                                }}
                                >Más</Button>
                            </div>)
                        })}
                    </div>
                </div>
            )

        }
        )




    if(isLoaded){
        console.log(sorteados);
        return(
            <div className="contenedorPrincipalDP">
                
                {mostrarPymes}



            </div>
    
    
    
        )
    }else{
        return(
            <Loading></Loading>
    
    
    
        )
    }
    




}