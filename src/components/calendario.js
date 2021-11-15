import {useLocation , useHistory, Link} from 'react-router-dom';

import React,{useState} from "react";
import { Button,Modal } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import axios from 'axios';
import AgregandoNota from './agregandoNota';

export default function Calendario(props){
    const disponibleONo =(valor)=>{
        return(valor ? <th className="columnaCalendario horarioDisponibleCalendario"> disponible</th>:
        <th className="columnaCalendario horarioReservadoCalendario">reservado</th>)
    }
    const location = useLocation();

    const [agregandoNota, setAgregandoNota] = useState(false);
    const [indexHorarioAgregandoNota, setIndexHorarioAgregandoNota] = useState(-1);


    const handleAgregandoNota = (i)=>{
        setIndexHorarioAgregandoNota(i);
        setAgregandoNota(!agregandoNota);
        
        
        
    }

    




    const { register, handleSubmit} = useForm();    
    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("fecha", data["fecha"]);
        formData.append("hora", data["hora"]);
        formData.append("idxServicio", props.idxServicio);

        

        const res = await fetch(location.pathname+"/calendario", {
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
    async function borrarServicio (i, idxServicio){
        const res = await axios({
            method:"DELETE",
            url:location.pathname+"/calendario", 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{
                "idxServicio":idxServicio,
                "idxHorario":i
            }
        })
        .then(resp =>{

            if (resp.data.status=="success"){
                window.location.reload()
            }
        })
        
        //.then(window.location.reload())
    }

    const mostrarCalendar = props.horarios.map((horario, i)=>{
        return(
            <tr key = {i}>
                <th className="columnaCalendario">
                {horario.fecha}

                </th>
                <th className="columnaCalendario">
                {horario.hora}

                </th>
                <th className="columnaCalendario">
                {horario.cliente}

                </th>
                <th className="columnaCalendario">
                {horario.direccion}

                </th>
                <th className="columnaCalendario">
                {horario.anotaciones}

                </th>
                
                {disponibleONo(horario.disponible)}

                <th className="columnaCalendario">
                <Button onClick={()=>handleAgregandoNota(i)}>Agregar Nota</Button>

                </th>
                <th className="columnaCalendario">
                <Button style={{backgroundColor:"red", borderColor:"red"}} onClick={()=>borrarServicio(i, props.idxServicio)}>Eliminar</Button>

                </th>
              
               


            </tr>
        )

    })



    return(
        <div id="contenedorSecundarioCalendario">
            
            <h3>Disponibilidad</h3>
            <div className="contenedorTablaCalendario">
            <table id="tablaCalendario">
                <tbody>
                <tr>
                    <th className="columnaCalendario">
                        fecha
                    </th>
                    <th className="columnaCalendario">
                        hora
                    </th>
                    <th className="columnaCalendario">
                        cliente
                    </th>
                    <th className="columnaCalendario">
                        dirección
                    </th>
                    <th className="columnaCalendario">
                        anotaciones
                    </th>
                    <th className="columnaCalendario">
                        disponibilidad
                    </th>
                    <th className="columnaCalendario">
                        Nueva Nota
                    </th>
                    <th className="columnaCalendario">
                        Eliminar
                    </th>
                    
                </tr>
                {mostrarCalendar}
                </tbody>
                
            </table>
            </div>
            <div>
                {agregandoNota ? <AgregandoNota
                indexServicio = {props.idxServicio}
                indexHorario = {indexHorarioAgregandoNota}
                ></AgregandoNota>:null}
            </div>
            <h3>Agregar disponibilidad</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input {...register("fecha")}  type="text" placeholder="fecha"></input>
                <input {...register("hora")}  type="text" placeholder="hora"></input>
                <button type ="submit">Agregar</button>
            </form>
            
            
        </div>
    )


}