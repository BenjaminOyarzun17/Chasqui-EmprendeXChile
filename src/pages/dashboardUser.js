import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';

import DisplayProductos from '../components/displayProductos';
import Loading from '../components/loading';

export default function DashboardUser(){

    const location = useLocation();
    const [datos, setDatos] = useState({});
    const [sorteados, setSorteados] = useState({});
    const [categorias, setCategorias] = useState({})
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
              console.log(result);
              if (result.message =="acceso restringido" || result.message =="token invalida"){
                  setIsLoaded("false")
              }
              if (result.message=="legal"){
                  setDatos(result.datos)  ;
                  setCategorias(result.categorias);
                  setSorteados(result.filtrados);
                  
                  setIsLoaded(true);

              }

            }
          )
      }, []);

      

      if(isLoaded){
        
        return(
            <div id = "contenedorPrincipalDU">
              
              <DisplayProductos
                datos ={sorteados}
                categorias = {categorias}
                >

                </DisplayProductos>



              
            </div>
    
    
        )

      }else{
        return(
        <Loading></Loading>
          )
      }

    






}