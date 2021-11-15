import {useLocation , useHistory, Link} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import Plot from 'react-plotly.js';

import Loading from '../components/loading';


export default function GananciasPyme(){



    const location = useLocation();
    const [pedidos, setPedidos] = useState([]);
    const [grafico, setGraficoGanancias] = useState({});
    const [graficoClientes, setGraficoClientes] = useState({});

    const [isLoaded, setIsLoaded] = useState(false);
    
    const { register, handleSubmit} = useForm();   

    

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
                setGraficoGanancias(result.plot)
                setGraficoClientes(result.plotClientes)
                //console.log(grafico);

                //setPedidos(result.datos);
                setIsLoaded(true);

                  
              }

            }
          )
      }, []);
    
    
    



    if(isLoaded){
        return(
            <div className="contenedorPrincipalPedidosPyme">
               <h2>Estadísticas pyme</h2>
               
               
               
               <div>
                   <h3>Ganancias por semana</h3>
                    <Plot {...grafico}/>

               </div>
                <div>
                    <h3>Clientes por semana</h3>

                    <Plot {...graficoClientes}/>
                    
                
                </div>               

            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }


   





}