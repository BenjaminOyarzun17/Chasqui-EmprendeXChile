import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import { Button } from 'react-bootstrap';
export default function BusquedaNavegacion(){
    const [isLoaded, setIsLoaded] = useState(false);
    const [categorias, setCategorias] = useState([]);

    const history = useHistory();
    useEffect(() => {
        fetch("/busquedaNavegacion", {
            method:"GET"
        })
          .then(res => res.json())
          .then(
            (result) => {
              
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal"){
                
                
               
                setCategorias(result.categorias);
                setIsLoaded(true);
                  
              }

            }
          )
      }, []);
    
    
    
    const { register, handleSubmit} = useForm();   

    const onSubmit = async (data) => {
        const formData = new FormData();
        
        formData.append("categoria", data["categoria"]);
        formData.append("tipo", data["tipo"]);
        
        console.log(formData);
        const res = await fetch("/busquedaNavegacion", {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="success"){
                console.log(data);
                history.push(
                    {
                        "pathname":"/buscar/resultado", 
                        "state":data
                    }
                    )
            }

        }).catch(
            history.push("/notLoggedIn")
        )
    };


    const mostrarOpcionesCategorias = categorias.map(
        (categoria, i)=>{
            return(
                <option value={categoria} key = {i}>
                    {categoria}
                </option>
            )

        }
        
        
        )

    if(isLoaded){
        return(
        
            <div id = "contenedorFormaNavegacion" className="itemNavegacion" >
                        <form className="formaNavegacion" onSubmit={handleSubmit(onSubmit)}>
                            <input list ="listaCategorias" {...register("categoria")} className="inputFormaNavegacion" placeholder="A la orden de tu Chasquido"/>
                            <datalist id="listaCategorias">
                                {mostrarOpcionesCategorias}
                            </datalist>



                            <select {...register("tipo")} className="filtrarFormaNavegacion" >
                               
                                <option value="productos">Productos</option>
                                <option value="servicios">Servicios</option>
                               
                            </select>
                            <Button style={{backgroundColor:"black", borderColor:"black"}} type="submit">Buscar</Button>


                            
                        </form>
                    </div>
       
    )

    }else{
        return(
            <div></div>
        )
    }
    



}