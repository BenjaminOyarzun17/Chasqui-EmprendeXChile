import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Loading from './loading';

export default function AdministrarProductos(){
    const location = useLocation();
    const [productos, setProductos] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [categorias, setCategorias] = useState([0]);
    const [tiposPyme, setTiposPyme] = useState([]);
    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    const { register, handleSubmit} = useForm();   

    
        const mostrarTiposPyme = tiposPyme.map((cate, i)=>{
            return(
                <option key = {i} value = {cate}>
                    {cate}
                </option>
            )
        })
        const mostrarInputCategoriaProducto =  categorias.map((categoria, i)=>{
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


    async function borrarServicio (i){
        console.log(i);
        const res = await axios({
            method:"DELETE",
            url:"/pyme/" +sessionStorage.getItem("userId")+"/administrar/productos", 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{"index":i}
        })
        .then(resp =>{
            console.log(resp);
            if (resp.data.status=="success"){
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }





    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fotoDescriptiva", data["fotoDescriptiva"]);
        formData.append("valor", data["valor"]);
        formData.append("descripcion", data["descripcion"]);
        formData.append("nombre", data["nombre"]);
        for ( var i = 0 ; i < data.imagenPrincipal.length; i+=1){
            formData.append("imagenPrincipal", data.imagenPrincipal[i]);
        }
        for (var i= 0; i< categorias.length; i+=1){
            formData.append("categoria"+i, data["categoria"+i]);
        }

        
        const res = await fetch("/pyme/" +sessionStorage.getItem("userId")+"/administrar/productos", {
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

    useEffect(() => {
        fetch("/pyme/" +sessionStorage.getItem("userId")+"/administrar/productos", {
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
                
                setProductos(result.datos);
                setIsLoaded(true);
                setTiposPyme(result.categorias);

                  
              }

            }
          )
      }, []);
    
      const mostrarProductos = productos.map((producto, i )=>{
        return(
            <div className="contenedorTarjetaProductoAdminProductos" key = {i}>
                <div className="contenedorImagenTarjetaProductoAdminProductos">
                    <img className="imagenTarjetaProductoAdminProductos" src= {producto.fotoDescriptiva}></img>

                </div>
                
                <div className="contenedorDatosTarjetaProductoAdminProductos">
                    <div >
                        <h5>
                        {producto.nombre}

                        </h5>

                    </div>

                    <ul className="listaDatosInformacionProductoAdminProductos" >
                   
                    <li>
                        <p className="parrafoTarjetaProductoAdminProductos">{producto.descripcion}</p>
                        
                    </li>
                    <li>
                        <p className="parrafoTarjetaProductoAdminProductos">Precio: ${nwc(producto.valor)}</p>
                        
                    
                    </li>
                   
                </ul>
                
                    <Button>Editar</Button>
                    <Button onClick = {() => borrarServicio(i)} className="botonEliminarProductoAdminProductos">Eliminar</Button>

                </div>
              
                
            </div>
        )




      })







    if (isLoaded){
        return(
            <div className="contenedorPrincipalAdminProductos">
                <div className="gridPrincipalAdminProductos">
            
                <div className="contenedorVisualizadorProductosActualesAdminProductos">
                Administrar productos

                    {mostrarProductos}
                </div>
                <div className="contenedorAgregarProductoAdminProducto">
                    Agregar productos
                    <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                            <label>Nombre servicio:</label>
                            <input {...register("nombre")}></input>
                            </div>    
                            <div className="form-group">
                            <div className="form-group">
                            <label>Categorias producto</label><br></br>
                            {mostrarInputCategoriaProducto}
                            <button   className="btn btn-primary" type="button" onClick={agregarInput} >Agregar adicional</button>

                            </div>
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
                            <label>Precio:</label>
                            <br></br>
                            <input {...register("valor")}></input>
                            </div>


                            <div className="form-group">
                            <input type="submit" value="Agregar producto"></input>

                            </div> 
                            
                        </form>



                </div>
                </div>
               


            </div>
        )
    }else{
        return (
            <Loading></Loading>
        )
    }






}