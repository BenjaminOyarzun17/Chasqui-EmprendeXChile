import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";
import { Button } from 'react-bootstrap';
import axios from 'axios';
import Loading from '../components/loading';
import { Modal } from 'react-bootstrap';

export default function CarritoUser(){
    const location = useLocation();
    const history = useHistory();
    const [isLoaded, setIsLoaded] = useState(false);
    const [hayCarro, setHayCarro] = useState(false);
    const [carro, setCarro] = useState([]);
    const [total, setTotal] = useState(0);
    const [tc, setTc] = useState(0);

    function nwc(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

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
                if (result.status=="no hay productos en el carrito") {
                    setHayCarro(false);
                }else{
                    setHayCarro(true);
                    setCarro(result.carrito);
                    setTotal(result.total);
                    setTc(result.impuestoChasqui);

                }
                
             
                setIsLoaded(true)
                  
                  

              }

            }
          )
      }, []);
    
    async function borrarElementoCarrito (i){
        console.log(i);
        const res = await axios({
            method:"DELETE",
            url:location.pathname, 
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



    
    const mostrarCarrito = carro.map((producto, i)=>{
        return(
            <div className="smallGridItemCarro" key={i}>
                <div className="columnaImagenItemCarro">
                <img className="imagenItemCarro" src={producto.urlImagen}></img>

                </div>
                <div className="columnaDescripcionItemCarro">
                    
                   
                    <h4>
                        {producto.nombre}
                    </h4>
                    <p>
                    {producto.descripcion}

                    </p>
                    <Button 
                    className="margenBoton"
                    onClick ={()=>{
                        history.push("/productos/"+producto.pymeId+"/"+producto.nombre)
                    }}
                    >
                    Más información
                    </Button>
                    <Button 
                    className="margenBoton"
                    onClick ={()=>{
                        history.push("/usuario/"+sessionStorage.getItem("userId")+"/perfil/"+producto.pymeId)
                    }}
                    >
                        Pyme
                    </Button>
                    <Button 
                    style={{backgroundColor:"red", borderColor:"red"}}
                    onClick={()=>{borrarElementoCarrito(i)}}
                    >
                        Eliminar
                    </Button>


               
                    
                </div>
                <div className="columnaValorItemCarro">
                    <h3>
                    ${nwc(producto.valor)}

                    </h3>
                    
                    
                    

                </div>
            </div>
        )


    })
    

    const mostrarPunteoResumen = carro.map((producto, i)=>{
        return(
            <li className="ulResumenCarrito" key = {i}>
                {producto.nombre}{": "}${nwc(producto.valor)}
            </li>
        )
    })
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function confirmarPago(carro){
       
        const res = await axios({
            method:"POST",
            url:location.pathname, 
            headers:{
                "authorization":sessionStorage.getItem("token")
            }, 
            data:{
                "productos":carro
            }
        })
        .then(resp =>{
            console.log(resp);
            if (resp.data.status=="success"){
                window.location.reload()
            }
        })


    }

    if(isLoaded && hayCarro){
        console.log(carro);
        return(
            <div id="contenedorPrincipalCarrito">
                <Modal  show={show} onHide={handleClose}>
                    <div className="modalConfirmarPago">
                    <h2>
                    Confirmar pago
                    </h2>
                    {mostrarPunteoResumen}
                    <h5>
                    Tarifa Chasqui: ${nwc(tc)}

                    </h5>
                    
                    <h4>
                    total: ${nwc(total)}
                    </h4>
                    </div>
                    <Button onClick={()=>confirmarPago(carro)}>
                        Confirmar pago
                    </Button>
                </Modal>
                <div className="gridPrincipalCarrito">
                <div className="contenedorColumnaCarrito">
                    <h1>
                    Carrito

                    </h1>
                {mostrarCarrito}
               </div>
                    <div className="contenedorResumenCarrito">
                        <div >
                            
                            <h2>
                                Resumen
                            </h2>
                            <ul className="ulResumenCarrito">
                                {mostrarPunteoResumen}
                            </ul>
                            <h5>
                            Tarifa Chasqui: ${nwc(tc)}

                            </h5>
                            
                            <h4>
                            total: ${nwc(total)}

                            </h4>
                            
                            <Button onClick={handleShow}>Pagar</Button>
                         </div>

                    </div>
                </div>

            </div>
        )
    }else if(isLoaded && hayCarro==false){
        return(
            <div id="contenedorPrincipalCarritos">
                No hay productos en el carro... ¿vamos a de compras?
            </div>
        )
    }else{
        return(
            <Loading></Loading>
        )
    }
    
    
    
      


}