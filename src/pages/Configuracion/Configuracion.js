import "./Configuracion.css"
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from "react";

const Configuracion = () => {
  const [archAero, setArchAero] = useState(null);
  const [archVuel, setArchVuel] = useState(null);

  const aeropuertosData = [
    {
      id: 1,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 2,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 3,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 4,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 5,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 6,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 7,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 8,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    },
    {
      id: 9,
      codigo: "SKBO",
      ciudad: "Bogota",
      pais: "Colombia",
      continente: "America del Sur",
      latitud: "4.704457",
      longitud: "-74.145925"
    }
  ];

  const vuelosData = [
    {
      id: 1,
      origen: "Lima - Perú",
      detino: "Madrid - España",
      horaDePartida: "00:40",
      horaDeLlegada: "06:25",
      tiempoDeVuelo: "11h 45m"
    },
    {
      id: 3,
      origen: "Lima - Perú",
      detino: "Madrid - España",
      horaDePartida: "00:40",
      horaDeLlegada: "06:25",
      tiempoDeVuelo: "11h 45m"
    },
    {
      id: 4,
      origen: "Lima - Perú",
      detino: "Madrid - España",
      horaDePartida: "00:40",
      horaDeLlegada: "06:25",
      tiempoDeVuelo: "11h 45m"
    },
    {
      id: 5,
      origen: "Lima - Perú",
      detino: "Madrid - España",
      horaDePartida: "00:40",
      horaDeLlegada: "06:25",
      tiempoDeVuelo: "11h 45m"
    },
    {
      id: 6,
      origen: "Lima - Perú",
      detino: "Madrid - España",
      horaDePartida: "00:40",
      horaDeLlegada: "06:25",
      tiempoDeVuelo: "11h 45m"
    }
  ];

  const tableAeropuertos =(
    <div className="config-table-container">
      <table className="w-100">
        <thead>
          <tr className="purpleBox">
            <th className="text-center config-table-id">ID</th>
            <th className="text-center">Código</th>
            <th className="text-center">Ciudad</th>
            <th className="text-center">País</th>
            <th className="text-center">Contiente</th>
            <th className="text-center">Latitud</th>
            <th className="text-center">Longitud</th>
          </tr>
        </thead>
        <tbody>
          {aeropuertosData.map(aeropuerto => {
            return (
              <tr key={aeropuerto.id}>
                <td className="text-end config-table-id">{aeropuerto.id}</td>
                <td className="text-center">{aeropuerto.codigo}</td>
                <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>{aeropuerto.continente}</td>
                <td>{aeropuerto.latitud}</td>
                <td>{aeropuerto.longitud}</td>
              </tr>
            );
          })}
          {aeropuertosData.map(aeropuerto => {
            return (
              <tr key={aeropuerto.id + 9}>
                <td className="text-end config-table-id">{aeropuerto.id + 9}</td>
                <td className="text-center">{aeropuerto.codigo}</td>
                <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>{aeropuerto.continente}</td>
                <td>{aeropuerto.latitud}</td>
                <td>{aeropuerto.longitud}</td>
              </tr>
            );
          })}
          {aeropuertosData.map(aeropuerto => {
            return (
              <tr key={aeropuerto.id + 18}>
                <td className="text-end config-table-id">{aeropuerto.id + 18}</td>
                <td className="text-center">{aeropuerto.codigo}</td>
                <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>{aeropuerto.continente}</td>
                <td>{aeropuerto.latitud}</td>
                <td>{aeropuerto.longitud}</td>
              </tr>
            );
          })}
          {aeropuertosData.map(aeropuerto => {
            return (
              <tr key={aeropuerto.id + 18}>
                <td className="text-end config-table-id">{aeropuerto.id + 18}</td>
                <td className="text-center">{aeropuerto.codigo}</td>
                <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>{aeropuerto.continente}</td>
                <td>{aeropuerto.latitud}</td>
                <td>{aeropuerto.longitud}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const aeropuertos = (
    <>
    <div className="col-md-6 p15 h-100">
      <div className="shadowbox grayBox h-100">
        <div className="config-title purpleBox">Aeropuertos <PlayArrowIcon style={{transform: "rotate(-90deg)"}}/></div>
        <div className="p15">
          <div className="row">
            <div className="col-md-4 my-auto">Archivo de aeropuertos:</div>
            <div className="col-md-4 my-auto">
              <label className="my-auto fileLabel" for="aeroFile"><UploadIcon/> Subir archivo</label>
              <input id="aeroFile" type="file" className="fileInput" onChange={(e) => {setArchAero(e.target.files[0])}}/>
            </div>
            <div className={`col-md-4 my-auto ${archAero ? "fileLabel" : ""}`}>
              { archAero ? <div><DownloadIcon/> {archAero.name}</div> : <></> }
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              {tableAeropuertos}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );

  const tableVuelos =(
    <div className="config-table-container">
      <table className="w-100">
        <thead>
          <tr className="purpleBox">
            <th className="text-center config-table-id">ID</th>
            <th className="text-center">Origen</th>
            <th className="text-center">Destino</th>
            <th className="text-center">Hora de partida</th>
            <th className="text-center">Hora de llegada</th>
            <th className="text-center">Tiempo de vuelo</th>
          </tr>
        </thead>
        <tbody>
          {vuelosData.map(vuelo => {
            return (
              <tr key={vuelo.id}>
                <td className="text-end config-table-id">{vuelo.id}</td>
                <td>{vuelo.origen}</td>
                <td>{vuelo.detino}</td>
                <td>{vuelo.horaDePartida}</td>
                <td>{vuelo.horaDeLlegada}</td>
                <td>{vuelo.tiempoDeVuelo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const vuelos = (
    <>
    <div className="col-md-6 p15 h-100">
      <div className="shadowbox grayBox h-100">
        <div className="config-title purpleBox">Vuelos <AirplanemodeActiveIcon className="rotate45"/></div>
        <div className="p15">
          <div className="row">
            <div className="col-md-4 my-auto">Archivo de vuelos:</div>
            <div className="col-md-4 my-auto">
              <label className="my-auto fileLabel" for="vuelosFile"><UploadIcon/> Subir archivo</label>
              <input id="vuelosFile" type="file" className="fileInput" onChange={(e) => {setArchVuel(e.target.files[0])}}/>
            </div>
            <div className={`col-md-4 my-auto ${archVuel ? "fileLabel" : ""}`}>
              { archVuel ? <div><DownloadIcon/> {archVuel.name}</div> : <></> }
            </div>
          </div>
          <div className="row mt-4">
            <div className="col">
              {tableVuelos}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );

  return(
    <div className="row h-100">
      {aeropuertos}
      {vuelos}
    </div>
  );
}

export default Configuracion;