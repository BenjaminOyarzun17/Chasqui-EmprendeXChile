import React from "react";
import { Button } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { useLocation, useParams } from "react-router";
export default function MostrarHorariosDisponibles(props){
    const location = useLocation();
    
    

    let p = useParams();

    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    async function reservarHora (fecha, hora){
        const res = await axios({
            method:"POST",
            url:location.pathname, 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{
                "idPyme":p.idPyme,
                "nombreServicio":p.nombreServicio, 
                "fecha":fecha, 
                "hora":hora, 
                "idUser":sessionStorage.getItem("userId")
            }
        })
        .then(resp =>{
            console.log(resp);
            if (resp.data.estadoReserva=="reservado"){
                alert("reservado!")
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }


    function botonAD(s, horario){
        if (s){
            return(
                <th className="columnaHorariosPymePOVU">
                        <Button onClick={()=>handleShow(horario)}>Reservar</Button>
                    
                 </th>
            )
        }else{
            return(
                <th className="columnaHorariosPymePOVU">
                        <Button disabled>Reservar</Button>
                    
                </th>
            )
        }

    }

    function handleDisponibilidad(s){
        if(s){
            return(<th className="columnaHorariosPymePOVU fondoVerdeDisponiblePOVU">
            Disponible</th>)
        }else{
            return(<th className="columnaHorariosPymePOVU fondoRojoDisponiblePOVU">
            no disponible
        </th>)
     }
    }

    const [horario, setHorario] =useState({})
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    function handleShow (horario) {
        setShow(true)
        setHorario(horario)
        

    };
    function FmostrarHorarios (lista){
        return(
        lista.map(
            (horario, i )=>{
                return(
                    <tr className="tablaPrincipalHorariosPymePOVU" key ={i}>
                    <th className="columnaHorariosPymePOVU">
                        {horario.fecha}
                    </th>
                    <th className="columnaHorariosPymePOVU">
                    
                        {horario.hora}
                    </th>
                    {handleDisponibilidad(horario.disponible)}
                    {botonAD(horario.disponible, horario)}
                    </tr>
                    
                )
            }

        )
        )  
        }
        

    
   
        
    


    console.log(props.datos);
    return(
        <div>
            <table>
                <tbody>
                    <tr className="tablaPrincipalHorariosPymePOVU">
                        <th className="columnaHorariosPymePOVU">
                            Fecha
                        </th>
                        <th className="columnaHorariosPymePOVU">
                        
                            Hora
                        </th>
                        <th className="columnaHorariosPymePOVU">
                        
                            Disponibilidad
                        </th>
                        <th className="columnaHorariosPymePOVU">
                        
                            Reservar
                        </th>
                    </tr>
                    {
                        props.horarios!=undefined? FmostrarHorarios(props.horarios): null
                    }
                    
                </tbody>
            
            </table>
            <Modal show={show} onHide={handleClose}>
                <div className="contenedorContenidoModalPago">
                    <h3>
                    Confirmar reserva
                    
                    </h3>
                    <p>
                        ¡Cuidado! Con esta acción estás pagando y reservando el horario seleccionado. 
                    </p>
                    <p>
                    fecha seleccionada: {horario.fecha}
                      
                    </p>
                    <p>
                    hora seleccionada: {horario.hora}
                        
                    </p>
                    
                    <p>
                    Valor: ${nwc(props.datos.valor)}

                    </p>
                    <p>
                    Tarifa Chasqui: ${nwc(props.datos.impuestoChasqui)}
                    </p>

                    <p>
                    
                    Valor Final: ${nwc(props.datos.valorTotal)}
                    

                        
                    </p>

                    <Button onClick={()=>reservarHora(horario.fecha, horario.hora)}>Pagar y reservar</Button>
                </div>
                
                
            </Modal>
            
        </div>
    )



}