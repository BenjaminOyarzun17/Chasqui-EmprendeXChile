
import {useLocation , useHistory} from 'react-router-dom';
import React,{useState, useEffect} from 'react'
import { useForm } from "react-hook-form";

export default function EditarPyme(){
    const location = useLocation();
    const history = useHistory();
    const [tipos, setTipos] = useState([0]);
    const [tiposPyme, setTiposPyme] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

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
    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("nombre", data["nombre"]);
        formData.append("userName", data["userName"]);
        formData.append("comuna", data["comuna"]);
        formData.append("direccion", data["direccion"]);
        formData.append("descripcion", data["descripcion"]);

        for (var i= 0; i< tipos.length; i+=1){
            formData.append("tipoPyme"+i, data["tipoPyme"+i]);
        }
        for ( var i = 0 ; i < data.imagenPerfil.length; i+=1){
            formData.append("imagenPerfil", data.imagenPerfil[i]);
        }


        
        const res = await fetch(location.pathname, {
            method: "POST", 
            headers:{
                "authorization": sessionStorage.getItem("token")
            },
            body:formData
        }).then(res => res.json())
        .then((data)=>{
            if (data["status"] =="done"){
                alert("cambios realizados")
            }

        })
        
    };

    const mostrarTiposPyme = tiposPyme.map((categoria, i)=>{
        return(
            <option key = {i} value = {categoria}>
                {categoria}
            </option>
        )
    })
    const mostrarInputTipoPyme =  tipos.map((tipo, i)=>{
        return(
            <div className="contenedorInputTipoPymeEditarPyme">
            
            <select {...register("tipoPyme"+i)}>
                                {mostrarTiposPyme}
                                
            </select>
            <br></br>
                
            </div>
        )

    })

   
    function agregarInput(){
        setTipos([...tipos, tipos[tipos.legth]+1]);

    }

    if(isLoaded){
        return(
            <div id="contenedorPrincipalEditarPyme">
                <h3>Editar pyme</h3>
                <div id ="gridPrincipalEditarPyme">
                    <div id = "informacionActualizarEditarPyme">
                        <form onSubmit={handleSubmit(onSubmit)}>
    
                    
                           
                            <div className="form-group">
                                <label>Tipos pyme</label><br></br>
                                {mostrarInputTipoPyme}
                                <button   className="btn btn-primary" type="button" onClick={agregarInput} >Agregar adicional</button>
    
                            </div>
                            <div>
                                <label>Nombre:</label>
                                <input {...register("nombre")} type = "text" className = "form-control"/>
    
                            </div>
                            <div className="form-group">
                                    <label >Imagen de perfil</label><br></br>
                                    <input {...register('imagenPerfil')} type="file" class="form-control-file" id="exampleformcontrolfile1"></input>
                                </div>
                            
                            <div>
                                <label>Nombre de usuario:</label>
                                <input {...register("userName")} type = "text" className = "form-control"/>
    
                            </div>
                        
                            <div>
                                <label>Comuna residencia:</label>
                                <input {...register("comuna")} type = "text" className = "form-control"/>
    
                            </div>
                            <div>
                                <label>Descripción:</label>
                                <textarea {...register("descripcion")} type = "text" className = "form-control"/>
    
                            </div>
                            <div>
                                <label>Dirección:</label>
                                <input {...register("direccion")} type = "text" className = "form-control"/>
    
                            </div>
                            <button id = "botonFormaSup" className="btn btn-primary" style = {{margintop:"20px"}}>Editar datos</button>
    
                    
    
    
                        </form>
                    </div>
                    <div id = "ContenedorImagenDecorativaEditarPyme">
                        <p id = "parrafoMotivacionalEditarPyme">
    
                        <i> Si queremos que todo siga como está, es necesario que todo cambie. (Giuseppe Tomasi di Lampedusa)</i>
    
                        </p>
                        <img id = "imagenDecorativaEditarPyme"src="https://sloanreview.mit.edu/wp-content/uploads/2021/02/GEN-Buckingham-Top10-1290x860-1.jpg"></img>
                    </div>
                </div>
                
    
    
    
    
    
            </div>
        )
    
    
    
    }else{
        return(<h1>Cargando...</h1>)
    }
}
   