import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Simulador from "./pages/Simulador/Simulador";
import OperacionesDiarias from "./pages/OperacionesDiarias/OperacionesDiarias";
import Configuracion from "./pages/Configuracion/Configuracion";
import NuevoEnvio from "./pages/NuevoEnvio/NuevoEnvio";
import ChatRoom from './components/ChatRoom';
import ColapsoLogistico from './pages/ColapsoLogistico/ColapsoLogistico';
import React from 'react';

function App() {
  return (
    <div className="App contenedor">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Simulador />} />
          <Route path="OperacionesDiarias" element={<OperacionesDiarias />} />
          <Route path="Simulador" element={<Simulador />} />
          <Route path="ColapsoLogistico" element={<ColapsoLogistico />} />
          <Route path="Configuracion" element={<Configuracion />} />
          <Route path="NuevoEnvio" element={<NuevoEnvio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// Chat de web socket
// function App() {
//   return <ChatRoom />;
// }

export default App;