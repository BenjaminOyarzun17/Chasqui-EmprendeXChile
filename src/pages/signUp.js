import {useLocation , useHistory} from 'react-router-dom';
import React,{useState,useEffect} from 'react'
import { useForm } from "react-hook-form";



export default function SignUp(){
    const location = useLocation();
    const history = useHistory();
    const [tiposPyme, setTiposPyme] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPyme, setIsPyme] = useState(true);
    const [isUser, setIsUser] = useState(false);




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
                setTiposPyme(result.categorias);
                
                setIsLoaded(true);

                  
              }

            }
          )
          
      }, []);


    function mostrarSiEsPyme(isPyme){
        if(isPyme){
            return(
                <div>
                    <label id = "labelSeleccionarTipoUsuarioSup">Tipo pyme:</label>
                    
                    <select {...register("tipoPyme")}>
                        {  mostrarTiposPyme}
                        
                    </select>
                    
                    
                </div>
            )

        }
    }


    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("userName", data["userName"]);
        formData.append("nombre", data["nombre"]);

        formData.append("tipo", data["tipo"]);
        formData.append("email", data["email"]);
        formData.append("comuna", data["comuna"]);
        formData.append("direccion", data["direccion"]);
        formData.append("edad", data["edad"]);
        if(isPyme){
            formData.append("tipoPyme", data["tipoPyme"]);

        }

        formData.append("password", data["password"]);

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
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.id);
                sessionStorage.setItem("tipo",data.tipo)
                history.push("/"+data["tipo"]+"/"+data["id"])
                window.location.reload()

            }

        })
        
    };
    const mostrarTiposPyme = tiposPyme.map((tipo, i)=>{
        return(
            <option key = {i} value = {tipo}>
                {tipo}
            </option>
        )
    })
    

    if(isLoaded){
        return(
            <div className="contenedorGridSup">
                <div className = "contenedorFormaSup">
                    <h2>
                        Crear cuenta
                    </h2>
                    <form id = "formaSup" onSubmit={handleSubmit(onSubmit)}>
                        
                        <div>
                            <label id = "labelSeleccionarTipoUsuarioSup">Registrarme como...</label>
                            
                            
                            <select  {...register("tipo")} >
                                <option value="pyme"
                                onClick={
                                    ()=>{
                                        setIsPyme(true)
                                        setIsUser(false)
                                    }
                                }
                                >
                                    Pyme
                                </option>
                                <option value ="usuario"
                                onClick={
                                    ()=>{
                                        setIsUser(true)
                                        setIsPyme(false)
                                    }
                                }
                                >
                                    Usuario
                                </option>
                               
    
                            </select>
                        </div>
                        {mostrarSiEsPyme(isPyme)}
                        <div>
                            <label>Correo:</label>
                            <input {...register("email")} type = "text" className = "form-control"/>
    
                        </div>
                        <div>
                            <label>Nombre:</label>
                            <input {...register("nombre")} type = "text" className = "form-control"/>
    
                        </div>
                        
                        <div>
                            <label>Nombre de usuario:</label>
                            <input {...register("userName")} type = "text" className = "form-control"/>
    
                        </div>
                        <div>
                            <label>Edad:</label>
                            <input {...register("edad")} type = "text" className = "form-control"/>
    
                        </div>
                        <div>
                            <label>Comuna residencia:</label>
                            <input {...register("comuna")} type = "text" className = "form-control"/>
    
                        </div>
                        <div>
                            <label>Dirección:</label>
                            <input {...register("direccion")} type = "text" className = "form-control"/>
    
                        </div>
                       
                        <div>
                            <label>Clave (debe contener más de 6 caracteres):</label>
                            <input {...register("password")} type = "password" className = "form-control"/> 
                        </div>
                        
                        
                        <button id = "botonFormaSup" className="btn btn-primary" style = {{margintop:"20px"}}>Crear cuenta</button>
                    </form>
                </div>
                <div id = "contenedorImagenSup" className="contenedorImagenSup">
                    
                    <img id= "imagenDerechaSup" src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Chasqui3.JPG"></img>
                    
                </div>
            </div>
        )
    }else{
        return <h1>cargando...</h1>
    }
       
    
    
}