import React from "react";
import { useHistory } from "react-router";
import { Button } from "react-bootstrap";
export default function NotLoggedIn(){
    const history = useHistory();

    return(
        <div className="contenedorNotLi">
            <h3>
            ¡No has iniciado sesión aún!


            </h3>
            
            <Button className='margenBoton' onClick={
                ()=>{
                    history.push('/login')
                }
            }>
                Acceder
            </Button>
            <Button  onClick={
                ()=>{
                    history.push('/signup')
                }
            }>
                Crear cuenta
            </Button>


        </div>
    )


}