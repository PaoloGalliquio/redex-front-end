import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OperacionesDiarias from "./pages/OperacionesDiarias/OperacionesDiarias";
import Simulador from "./pages/Simulador/Simulador";
import Configuracion from "./pages/Configuracion/Configuracion";
import NuevoEnvio from "./pages/NuevoEnvio/NuevoEnvio";
import ChatRoom from './components/ChatRoom'
import React from 'react';

function App() {
  return (
    {/*<div className="App contenedor">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<OperacionesDiarias />} />
          <Route path="OperacionesDiarias" element={<OperacionesDiarias />} />
          <Route path="Simulador" element={<Simulador />} />
          <Route path="ColapsoLogistico" element={<OperacionesDiarias />} />
          <Route path="Configuracion" element={<Configuracion />} />
          <Route path="NuevoEnvio" element={<NuevoEnvio />} />
        </Routes>
      </BrowserRouter>
    </div> */}
    <ChatRoom />
  );
}

export default App;
