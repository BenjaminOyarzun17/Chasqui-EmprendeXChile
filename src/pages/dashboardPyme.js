import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';

import Loading from '../components/loading';
export default function DashboardUser(){
    const location = useLocation();
    const [datos, setDatos] = useState({});
    const [tiposPyme , setTiposPyme]= useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const history = useHistory();
    
    
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
                  setDatos(result.datos);
                  setTiposPyme(result.datos.tiposPyme);
                  setIsLoaded(true);

              }

            }
          )
      }, []);

      
    
    const editarDatos = (location) =>{
        history.push(location.pathname +"/editarDatos");

    }
    const mostrarTiposPyme = tiposPyme.map((tipo, i)=>{
        return(
            
                <li key={i}>{tipo}</li>
            
        )
    })

    if(isLoaded){
        return(
            <div id ="contenedorPrincipalDPyme">
               
    
                <div id ="infoGeneralDPyme">
                    <h3>Mi perfil</h3>
                    <img src={datos.urlPerfil}></img>
                    <p>{datos.descripcion}</p>
                    <p>Nombre de mi pyme: {datos.nombre}</p>
                    <p>Tipo de pyme: </p>
                    <ul>
                    {mostrarTiposPyme}
                    </ul>
                    
                    <p>Direccion actual: {datos.direccion}</p>
                    <p>Comuna actual: {datos.comuna}</p>

                    <Button onClick = {(e)=>editarDatos(location, e)}>
                        
                        Editar mi perfil

                       
                    </Button>
                    
                </div>
                <div id="rankingDPyme">
                    <h3>
                    Estado actual

                    </h3>
                    <p>Ranking comunal mensual: {datos.stats.ranking}º</p>
                    <p>Clientes semana: {datos.stats.clientesSemana}</p>
                    <p>Clientes mes: {datos.stats.clientesMes}</p>

                    <p>Ventas semana: {datos.stats.ventasSemana}</p>
                    <p>Ventas mes: {datos.stats.ventasMes}</p>
                    <p>Ganancias semana: ${datos.stats.gananciasSemana}</p>
                    <p>Ganancias mes: ${datos.stats.gananciasMes}</p>
                    


                </div>
                
              
            </div>
    
    
        )
    }else{
        return(
            <Loading></Loading>
        )
    }
    






}