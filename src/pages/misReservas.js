import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../components/loading';
import { Modal } from 'react-bootstrap';


export default function MisReservas(){


    const location = useLocation();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);

    const [reservas, setReservas] = useState([]);
    const [hayReservas, setHayReservas] = useState(false);

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
                if (result.status=="no hay reservas") {
                    setHayReservas(false);
                }else{
                    setHayReservas(true);
                    setReservas(result.datos);


                }
                
             
                setIsLoaded(true)
                  
                  

              }

            }
          )
      }, []);


    const mostrarRerservas = reservas.map((reserva, i)=>{
        return(
            <tr key={i}>
                                            <th className="columnaInputResreva">

                    {reserva.nombreServicio}
                </th>
                <th className="columnaInputResreva">
                <Button onClick={
                    ()=>{
                        history.push("/usuario/"+sessionStorage.getItem("userId")+"/perfil/"+reserva.idPyme)
                    }
                }>
                {reserva.nombrePyme}

                </Button>
                    
                </th>
                <th className="columnaInputResreva">

                {reserva.fecha}
                    
                </th>
                <th className="columnaInputResreva">

                {reserva.hora}
                    
                </th>
            </tr>
        )
    })


    if(isLoaded && hayReservas){
        console.log(reservas);
        return(
            <div className="contenedorPrincipalMisReservas">
                <h3>
                Mis reservas
                <table className="tablaReservas">
                    <tbody>
                        <tr>
                            <th className="columnaInputResreva">
                                Servicio
                            </th>
                            <th className="columnaInputResreva">

                                Pyme
                            </th>
                            <th className="columnaInputResreva">

                                Fecha
                            </th>
                            <th className="columnaInputResreva">

                                Hora
                            </th>
                            
                        </tr>
                {mostrarRerservas}

                    </tbody>

                </table>

                </h3>
            </div>
        )
    }else if(isLoaded && !hayReservas){
        return(
            <div className="contenedorPrincipalMisReservas">
                <h3>
                No hay reservas activas.
    
                </h3>
            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }

    
      
    




}