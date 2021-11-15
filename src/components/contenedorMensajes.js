import React from "react";
import {Button} from 'react-bootstrap';
import { useForm } from "react-hook-form";
import {useLocation , useHistory} from 'react-router-dom';


export default function ContenedorMensajes(props){


    const location  = useLocation();
    const history = useHistory();
    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("content", data["content"]);
        
        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                window.location.reload(false); 
            }

        })
    };

    function determinarOrigen(o){
        if( o.from=="me"){
            return(
            <div className="contenedorWrapperMensaje">
            
                <div className="mensajePropio">
                    <div className="mensaje ">
                    
                    {o.content}

                    </div>
                
                </div>
            
            </div>
            )
        }
        if (o.from=="receiver"){
            return(
            <div className="contenedorWrapperMensaje">
            <div className="mensaje">
                {o.content}
                
            </div>
            </div>
            )
        }
    }



    const mostrarMensajes = props.mensajes.map((mensaje, i)=>{
        return(
            <div key={i}>
                {determinarOrigen(mensaje)}
            </div>
        )
    }) 


    console.log("ready");
    return(
        <div className="contenedorPrincipalChatEspecifico" >
            <div className="contenedorHeaderChatEspecificoChatsPyme">
                <h4>{props.receiverName}</h4>

            </div>
            <div className="contenedorMensajesChatEspecificoChatsPyme">
                <div className="contenedorMensajesScrollerChatsPyme">
                {mostrarMensajes}
                </div>

            </div>
            

            
            <div className="contenedorSubmitMessagePyme">
            <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("content")}  className="enviarMensajePyme"></input>
                    <button  className="btn btn-primary" style = {{margintop:"20px", width:"10%"}}>Enviar</button>

                    
            </form>
            </div>
        </div>
    )




}