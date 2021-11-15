import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';

import Loading from '../components/loading';


export default function ChatsPyme(){
    const location = useLocation();
    const history = useHistory();
    const [datos, setDatos] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const [hayChats, setHayChats] = useState(false);

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
                if(result.datos=="no hay chats") {
                    setHayChats(false);
                }else{
                    setDatos(result.datos)  ;
                    setHayChats(true);
                }
                
                  
                  
                  
                  setIsLoaded(true);

              }

            }
          )
      }, []);
    
    const mostrarChats = Object.keys(datos).map((chat, i)=>{

        return(
            <div key = {i}>
                <div className="gridChatUser">
                   
                    <div>
                    <h3>
                    {datos[chat].nombre}

                    </h3>
                    <div>

                    <Button 
                    onClick ={
                        ()=>{
                            history.push(location.pathname+"/"+datos[chat].idR)
                        }
                    }
                    >Ver mensajes</Button>
                    </div>
                    </div>
                </div>
                
                
                
                

                
            </div>
        )


    })





    if(isLoaded && hayChats){
        return(
            <div className="contenedorPrincipalChatsUser">
                <h3>
                Contactos Anteriores

                </h3>
                {mostrarChats}
        
            </div>
            )
    }else if(isLoaded && !hayChats){
        return(
            <div className="contenedorPrincipalChatsUser">
                <h3>
                Todavía no han llegado mensajes nuevos.

                </h3>
            </div>
        )

    }else{
        return(
            <Loading></Loading>
        )
    }
    
    
    
    




}