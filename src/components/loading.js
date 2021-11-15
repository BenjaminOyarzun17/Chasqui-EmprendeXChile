import React from "react";
import ReactLoading from "react-loading";
import centrada from '../images/centradav2.jpeg';

export default function Loading(){

    return(
        <div className="contenedorCargando">
            <img style={{width:"30%", height:"auto"}} src={centrada} ></img>
            <ReactLoading type={"bars"}  className="itemCargando" color="black" />

          
            <h3>Cargando...</h3>
        </div>
    )




}