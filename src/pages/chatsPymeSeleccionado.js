import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import ContenedorMensajes from '../components/contenedorMensajes';

import Loading from '../components/loading';
export default function ChatPymeSeleccionado(){
    const location = useLocation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [receiverId, setReceiverId] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [mensajes, setMensajes] = useState([])
    
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
                setIsLoaded(true);
                setMensajes(result.mensajes);
                setReceiverName(result.userName)
                setReceiverId(result.userId)
                  
              }

            }
          )
      }, []);
      
    
    if(isLoaded){
        return(
            <div className="contenedorPrincipalChatsPyme">
                
               
                <ContenedorMensajes
                mensajes = {mensajes}
                receiverName={receiverName}
                >

                </ContenedorMensajes>
                



            </div>
            

            
     
         )
    }else{
        return(
        <Loading></Loading>
            )
    }
    






}