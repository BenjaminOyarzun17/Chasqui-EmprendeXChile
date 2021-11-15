import {useLocation , useHistory} from 'react-router-dom';
import React from 'react'
import { useForm } from "react-hook-form";



export default function Login(){

    const location  = useLocation();
    const history = useHistory();
    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("tipo", data["tipo"]);
        formData.append("email", data["email"]);
        formData.append("password", data["password"]);

        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.id);
                sessionStorage.setItem("tipo",data.tipo)
                

                history.push("/"+data["tipo"]+"/"+data["id"])
                window.location.reload()
                
            }

        })  
    };
    return(
        <div id = "contenedorLogin">
            <h1>Iniciar sesión</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label id = "labelSeleccionarTipoUsuarioSup">Soy un/a...</label>
                
                <select {...register("tipo")} >
                    <option value="usuario">usuario</option>
                    <option value ="pyme">pyme</option>
                </select>
                <br></br>

                <input className="margenInput" type="text" placeholder="correo" {...register("email")}></input>
                <br></br>
                <input className="margenInput" type="password" placeholder ="clave" {...register("password")}></input>
                <br></br>

                <button 
                
                className="btn btn-primary margenInput" style = {{margintop:"20px"}}>Acceder</button>



            </form>


        </div>


    )





}
