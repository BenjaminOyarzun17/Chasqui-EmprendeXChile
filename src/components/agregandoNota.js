import React from "react";
import { Button } from "react-bootstrap";
import {useLocation , useHistory, Link} from 'react-router-dom';
import { useForm } from "react-hook-form";
import axios from 'axios';

export default function AgregandoNota(props){
  
    const location = useLocation();
    const { register, handleSubmit} = useForm();    

    async function borrarAnotacion (){
        const res = await axios({
            method:"DELETE",
            url:location.pathname+"/calendario/agregandoNota", 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{
                "indexServicio":props.indexServicio,
                "indexHorario":props.indexHorario
            }
        })
        .then(resp =>{

            if (resp.data.status=="success"){
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }



    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("anotaciones", data["contenidoNota"]);
        formData.append("indexServicio", props.indexServicio);
        formData.append("indexHorario", props.indexHorario);

        

        

        const res = await fetch(location.pathname+"/calendario/agregandoNota", {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                window.location.reload(false);
                //alert("agregado exitosamente")
            }

        })  
    };
    return(
        <div>
            <h3>Nueva nota</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("contenidoNota")} placeholder="contenido"></input>
                <button type="submit">Agregar</button>
            </form>
            <Button onClick={()=>borrarAnotacion()}>Eliminar nota</Button>
        </div>
    )



}

