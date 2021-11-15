import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';

import Loading from '../components/loading';


export default function ChatsUser(){
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
                    <div className="columnaImagenChatsUser">
                        <img className="imagenChatsUser" src={datos[chat].urlPerfil}></img>
                    </div>
                    <div className="columnaTextoChatsUser">
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
                    >Chat</Button>
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
                Chats user

                </h3>
                {mostrarChats}
        
            </div>
            )
    }else if(isLoaded && !hayChats){
        return(
            <div className="contenedorPrincipalChatsUser">
                <h3>
                No has iniciado ningún chat con ninguna pyme aún.  

                </h3>
            </div>
        )

    }else{
        return(
            <Loading></Loading>
        )
    }
    
    
    
    




}