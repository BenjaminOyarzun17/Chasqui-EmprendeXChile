
import React from "react";

import { Tabs,Tab } from "react-bootstrap";
import AdministrarProductos from "../components/administrarProductos";
import AdministrarServicios from "../components/administrarServicios";
import Loading from "../components/loading";



export default function AdministrarSyP(){

    return(
        <div id = "contenedorPrincipalAdminProductos">
            
            

            
            <Tabs defaultActiveKey="servicios" id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="servicios" title="Servicios">
            <h5>
                <AdministrarServicios></AdministrarServicios>
            </h5>
            </Tab>
            <Tab eventKey="productos" title="Productos">
            <h5>
                <AdministrarProductos></AdministrarProductos>
            </h5>
            </Tab>

            
            </Tabs>

        </div>

    )



}