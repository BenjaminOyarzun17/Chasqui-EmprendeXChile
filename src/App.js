import './App.css';
import {useLocation , useHistory} from 'react-router-dom';
import React,{useEffect, useState} from 'react'
import { useForm } from "react-hook-form";

import DisplayProductos from './components/displayProductos';
import { Carousel, Button } from 'react-bootstrap';
import Loading from './components/loading';
import slide1 from './images/slide1.jpeg';
import slide2 from './images/slide2.jpeg';
import slide3 from './images/slide3.jpeg';




export default function App() {
  const history = useHistory()
  return (
    <div style={{height:"80vh"}}>
        <Carousel interval={10000} >
        
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={slide3}
            alt="Third slide"
          />

         
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={slide1}
            alt="Second slide"
          />

          
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={slide2}
            alt="Third slide"
          />

         
        </Carousel.Item>
       
      </Carousel>
    </div>
  );
}