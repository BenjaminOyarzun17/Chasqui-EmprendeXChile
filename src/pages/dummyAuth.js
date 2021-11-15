import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import React from "react";
import { useForm } from "react-hook-form";



export default function DummyAuth(){
    let location = useLocation();
    const [datos, setDatos] = useState([]);
    const [isLoaded, setIsLoaded] = useState("");
    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("nombre", data["nombre"]);
        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        
    };
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
                  setIsLoaded("true")
                  setDatos(result.propiedades);
              }

            }
          )
      }, [])
    if (isLoaded=="false"){
        return <p>Acceso restringido</p>
    }else if (isLoaded=="true"){   
    return(
        <div style={{margin:"30px"}}>
            
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>nombre propiedad:</label>
                    <input  {...register('nombre')}  type="text" className="form-control"  ></input>
                </div>
                <button className="btn btn-primary" style = {{margintop:"20px"}}>agregar página</button>
            </form>

        </div>
    )
    }else {
        return <h1>Loading...</h1>
    }
}