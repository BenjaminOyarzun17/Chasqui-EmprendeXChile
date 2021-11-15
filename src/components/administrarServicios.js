import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button,Modal } from 'react-bootstrap';
import axios from 'axios';
import Calendario from '../components/calendario.js'
import Loading from './loading.js';

export default function AdministrarServicios(){
    const location = useLocation();
    const [servicios, setServicios] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [categorias, setCategorias] = useState([0]);
    const [calendarioActivado, setCalendarioActivado] = useState(false);
    const [horariosCalendario, setHorariosCalendario] = useState([]);
    const [indexCalendario, setIndexCalendario] = useState(0);
    const [tiposPyme, setTiposPyme] = useState([]);

    
    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("nombre", data["nombre"]);
        formData.append("fotoDescriptiva", data["fotoDescriptiva"]);
        formData.append("descripcion", data["descripcion"]);
        formData.append("duracion", data["duracion"]);
        formData.append("valor", data["valor"]);
        for (var i= 0; i< categorias.length; i+=1){
            formData.append("categoria"+i, data["categoria"+i]);
        }
        for ( var i = 0 ; i < data.imagenPrincipal.length; i+=1){
            formData.append("imagenPrincipal", data.imagenPrincipal[i]);
        }


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
                //alert("agregado exitosamente")
            }

        })  
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
                
                setServicios(result.datos);
                for (var t=0; t<result.datos.length; t+=1){
                    setHorariosCalendario(horariosCalendario=>[...horariosCalendario, result.datos[t].horarios]);
                }
                setTiposPyme(result.categorias);

                setIsLoaded(true);

                  
              }

            }
          )
          
      }, []);




    async function borrarServicio (i){
        const res = await axios({
            method:"DELETE",
            url:location.pathname, 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{"index":i}
        })
        .then(resp =>{

            if (resp.data.status=="success"){
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }
    const mostrarTiposPyme = tiposPyme.map((cate, i)=>{
        return(
            <option key = {i} value = {cate}>
                {cate}
            </option>
        )
    })
    const mostrarInputCategoriaServicio =  categorias.map((categoria, i)=>{
        return(
            <div className="contenedorInputTipoPymeEditarPyme">
            
            <select {...register("categoria"+i)}>
                                {mostrarTiposPyme}
                                
            </select>
            <br></br>
                
            </div>
        )

    })    
    function agregarInput(){
        setCategorias([...categorias, categorias[categorias.legth]+1]);

    } 
    const handleCalendario = (calendarioActivado,i)=>{
        setIndexCalendario(i);
        setCalendarioActivado(!calendarioActivado);
    }
    const handleClose = () => setCalendarioActivado(false);
    const mostrarServicos = servicios.map((servicio, i )=>{
        
        return(
            <div  className="contenedorServicioAdminServicios" key = {i}>
                <div className="contenedorImagenDescriptivaServicioTarjetaAdminServicios">
                <img className="imagenDescriptivaServicioTarjetaAdminServicios" src={servicio.fotoDescriptiva}></img>

                </div>
                <div className="contenedorInformacionServicioAdminServicios">
                <h5>
                    {
                        servicio.nombre
                    }
                </h5>
                <ul className="listaDatosInformacionSercioAdminServicio" >
                    <li>
                    <p className="parrafoTarjetaServicioAdminServicios">{servicio.descripcion}</p>
                        
                        
                    </li>
                    <li>
                        <p className="parrafoTarjetaServicioAdminServicios">Duración: {servicio.duracion}</p>
                        
                    </li>
                    <li>
                        <p className="parrafoTarjetaServicioAdminServicios">Valor: ${servicio.valor}</p>
                        
                    
                    </li>
                </ul>
                <Button onClick ={()=>
                    handleCalendario(calendarioActivado,i)} >Administrar horario</Button>
                
                <Button onClick = {() => borrarServicio(i)} className="botonEliminarServicioAdminServicios">Eliminar servicio</Button>
               
                </div>
                
            </div>

        )


    })

    


    if (isLoaded){
        return(
            <div>
                
                <div className="gridPrincipalAdminServicios">
                    <div className="contenedorVisualizadorServiciosActualesAdminServicios">
                        <h5>Servicios actuales</h5>
                        {mostrarServicos}
                        <Modal id = "contenedorCalendario" show={calendarioActivado} onHide={handleClose}>
                                <Calendario
                                horarios = {horariosCalendario[indexCalendario]}
                                idxServicio = {indexCalendario}
                                ></Calendario>
                        </Modal>

                    </div>
                    <div className="contenedorAgregarServicioAdminServicios">
                        <h5>Crear servicio</h5>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                            <label>Nombre servicio:</label>
                            <input {...register("nombre")}></input>
                            </div>    
                            <div className="form-group">
                            <label>Categorias producto</label><br></br>
                            {mostrarInputCategoriaServicio}
                            
                            <button   className="btn btn-primary" type="button" onClick={agregarInput} >Agregar adicional</button>

                            </div>
                            <div className="form-group">
                            <label>Foto descriptiva:</label>
                            <input {...register("fotoDescriptiva")}></input>
                            </div> 
                            <div className="form-group">
                                <label >imagen principal</label><br></br>
                                <input {...register('imagenPrincipal')} type="file" class="form-control-file" id="exampleformcontrolfile1"></input>
                            </div>
                            <div className="form-group">
                            <label>Descripcion:</label>
                            <input {...register("descripcion")}></input>
                            </div> 
                            <div className="form-group">
                            <label>Duracion:</label>
                            <input {...register("duracion")}></input>
                            
                            </div> 
                            
                            <div className="form-group">
                            <label>Precio:</label>
                            <br></br>
                            <input {...register("valor")}></input>
                            </div>


                            <div className="form-group">
                            <input type="submit" value="Agregar servicio"></input>

                            </div> 
                            
                            
                            
                            




                        </form>




                    </div>
                    
                </div>                
              










            </div>
    
        )
    }else{
        return(
            <Loading></Loading>
        )
    }


    



}