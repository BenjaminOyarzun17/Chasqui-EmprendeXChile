import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import SignUp from './pages/signUp'
import Navegacion from './components/navegacion.js'
import DashboardUser from './pages/dashboardUser.js';
import Login from './pages/login.js';
import DashboardPyme from './pages/dashboardPyme.js';
import ChatsPyme from './pages/chatsPymeBase.js';
import ChatPymeSeleccionado from './pages/chatsPymeSeleccionado.js';

import AdministrarSyP from './pages/administradorSyP.js';

import PedidosPyme from './pages/pedidosPyme.js';
import EditarPyme from './pages/editarPyme';
import GananciasPyme from './pages/gananciasPyme.js';
import InfoProductoPOVUser from './pages/infoProductoPOVUser';
import InfoServicioPOVUser from './pages/infoServicioPOVUser';
import CarritoUser from './pages/carritoUser.js';
import PerfilPymePublico from './pages/perfilPymePublico.js';
import DescubrirPymes from './pages/descubrirPymes.js';
import ResultadosBusqueda from './pages/resultadosBusqueda.js';
import PedidosUser from './pages/pedidosUser.js';
import MisReservas from './pages/misReservas.js';
import ChatsUser from './pages/chatsUser.js';
import ChatUserEspecifico from './pages/chatUserEspecifico.js';
import NotLoggedIn from './pages/notli.js';



//  ./ngrok http 3000 -host-header="localhost:3000"
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      
      <Switch>
        <Route path="/notLoggedIn">
          <Navegacion></Navegacion>
          <NotLoggedIn></NotLoggedIn>
        </Route>
        <Route path="/pyme/:idPyme/administrar">
          <Navegacion></Navegacion>
          <AdministrarSyP></AdministrarSyP>
        </Route>
        <Route path="/pyme/:idPyme/editarDatos">
          <Navegacion></Navegacion>
          <EditarPyme></EditarPyme>
          
        </Route>
        <Route path="/pyme/:idPyme/pedidos">
          <Navegacion></Navegacion>
          <PedidosPyme></PedidosPyme>
        </Route>
        <Route path="/pyme/:idPyme/mensajes/:rId">
          <Navegacion></Navegacion>
          <ChatPymeSeleccionado></ChatPymeSeleccionado>
        </Route>
        <Route path="/pyme/:idPyme/mensajes">
          <Navegacion></Navegacion>
          <ChatsPyme></ChatsPyme>
        </Route>
        <Route path="/pyme/:idPyme/ganancias">
          <Navegacion></Navegacion>
          <GananciasPyme></GananciasPyme>
        </Route>
        



        <Route path="/pyme/:idPyme">
          <Navegacion></Navegacion>
          <DashboardPyme></DashboardPyme>
        </Route>
        <Route path="/usuario/:idPyme/mensajes/:rId">
          <Navegacion></Navegacion>
          <ChatUserEspecifico></ChatUserEspecifico>
        </Route>
        <Route path="/usuario/:idUser/mensajes">
          <Navegacion></Navegacion>
          <ChatsUser></ChatsUser>
        </Route>
       

        <Route path="/usuario/:idUser/carrito">
          <Navegacion></Navegacion>
          
          <CarritoUser></CarritoUser>
        </Route>

        <Route path="/usuario/:idUser/perfil/:idPyme">
          <Navegacion></Navegacion>
          <PerfilPymePublico></PerfilPymePublico>          
        </Route>
        <Route path="/usuario/:idUser/descubrirPymes">
          <Navegacion></Navegacion>
          
          <DescubrirPymes></DescubrirPymes>
        </Route>

        <Route path="/usuario/:idUser/misPedidos">
          <Navegacion></Navegacion>
          
          <PedidosUser></PedidosUser>
        </Route>
        <Route path="/usuario/:idUser/misReservas">
          <Navegacion></Navegacion>
          
          <MisReservas></MisReservas>
        </Route>



        <Route path="/usuario/:idUser">
          <Navegacion></Navegacion>
          
          <DashboardUser></DashboardUser>
        </Route>
        <Route path="/buscar/resultado">
          <Navegacion></Navegacion>
          
          <ResultadosBusqueda></ResultadosBusqueda>
        </Route>


        <Route path="/productos/:idPyme/:nombreProducto">
          <Navegacion></Navegacion>
          <InfoProductoPOVUser></InfoProductoPOVUser>
        </Route>
        <Route path="/servicios/:idPyme/:nombreServicio">
          <Navegacion></Navegacion>
          <InfoServicioPOVUser></InfoServicioPOVUser>
        </Route>



        {
        /*
         <Route path="/usuario/:idUser">
          <App/>
        </Route><Route path="/usuario/:idUser/buscarPymes">
          <App/>
        </Route><Route path="/usuario/:idUser/buscarPymes/:idPyme">
          <App/>
        </Route><Route path="/usuario/:idUser/misPedidos">
          <App/>
        </Route><Route path="/usuario/:idUser/account">
          <App/>  
        </Route><Route path="/pyme/<idPyme>/adminProductos">
          <App/>
        </Route><Route path="/pyme/<idPyme>/mensajes">
          <App/>
        </Route><Route path="/pyme/<idPyme>/mensajes/:rId">
          <App/>
        </Route><Route path="/pyme/<idPyme>/account">
          <App/>
        </Route><Route path="/pymeLogin">
          <App/>
        </Route>
        <Route path="/userLogin">
         <App/>
        </Route>
        
        
        
        
        */

        }
        <Route path="/login">
        <Navegacion></Navegacion>
         <Login></Login>
        </Route>
        <Route path ="/signup">
        <Navegacion></Navegacion>
          <SignUp> </SignUp>
        </Route>
        <Route path ="/">
        <Navegacion></Navegacion>
          <App/>
        </Route>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
