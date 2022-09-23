import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OperacionesDiarias from './pages/OperacionesDiarias/OperacionesDiarias';
import Simulador from './pages/Simulador/Simulador';

function App() {
  return (
    <div className="App contenedor">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<OperacionesDiarias/>}/>
          <Route path='OperacionesDiarias' element={<OperacionesDiarias/>}/>
          <Route path='Simulador' element={<Simulador/>}/>
          <Route path='ColapsoLogistico' element={<OperacionesDiarias/>}/>
          <Route path='Configuracion' element={<OperacionesDiarias/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
