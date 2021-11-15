import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import ContenedorMensajes from '../components/contenedorMensajes';

import Loading from '../components/loading';


export default function ChatUserEspecifico(){
    const location = useLocation();
    
    const [isLoaded, setIsLoaded] = useState(false);
    const [hayChats, setHayChats] = useState(false);
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
              console.log(result);
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal"){
                if(result.datos=="no hay chats con esta pyme") {
                    setHayChats(false);
                }else{
                    setMensajes(result.mensajes);
                    setReceiverName(result.userName)
                    setReceiverId(result.userId)
                    setHayChats(true);
                }
                
                
               
                  
                  
                  
                  setIsLoaded(true);

              }

            }
          )
      }, []);
    
      const { register, handleSubmit} = useForm();   

    const onSubmit = async (data) => {
        const formData = new FormData();
        
        formData.append("content", data["content"]);
        
        
        console.log(formData);
        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                console.log(data);
                window.location.reload();
            }

        })  
    };





    if(isLoaded && hayChats){
        return(
            <div>
                <ContenedorMensajes
                mensajes = {mensajes}
                receiverName={receiverName}
                >

                </ContenedorMensajes>
                
        
            </div>
            )
    }else if(isLoaded && !hayChats){
        return(
            <div className="contenedorGrandeNoMessage">
                
                
                <h3>
                No has mandado aun ningun mensaje a esta pyme

                </h3>
                <div className='contenedorInferiorNoMessageYet'>
                <form  onSubmit={handleSubmit(onSubmit)}>
                    <input className="inputNoMessageYet" {...register('content')} placeholder="escribe un mensaje..."></input>
                    <Button type ='submit'>Enviar</Button>
                </form>
                </div>
                
            </div>
        )

    }else{
        return(
            <Loading></Loading>
        )
    }
    
    
    
    




}