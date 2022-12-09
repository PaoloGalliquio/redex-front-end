import "./Configuracion.css"
import React, { useState, useEffect } from "react";

import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { TextField } from "@mui/material";

import { getAeropuertos } from "../../services/Aeropuertos";
import { getVuelos } from "../../services/Vuelos";
import { getConfiguraciones, updateConfiguraciones } from "../../services/Configuraciones";
import RedirectButton from "../../components/RedirectButton/RedirectButton";

const Configuracion = () => {
  const [archAero, setArchAero] = useState(null);
  const [archVuel, setArchVuel] = useState(null);
  const [aeropuertosData, setAeropuertosData] = useState(null);
  const [vuelosData, setVuelosData] = useState(null);
  const [configuracionesData, setConfiguracionesData] = useState({
    CapacidadAeropuertoAmerica: 
    {id: "", nombre: "CapacidadAeropuertoAmerica", valor: ""},
    CapacidadAeropuertoEuropa: 
    {id: "", nombre: "CapacidadAeropuertoEuropa", valor: ""},
    CapacidadAvionAmerica: 
    {id: "", nombre: "CapacidadAvionAmerica", valor: ""},
    CapacidadAvionEuropa: 
    {id: "", nombre: "CapacidadAvionEuropa", valor: ""},
    CapacidadAvionInterc: 
    {id: "", nombre: "CapacidadAvionInterc", valor: ""}
  });

  const styles = {
    field: {
      "& .MuiInputBase-root": {
        color: "white",
      },
      "& .MuiFormLabel-root": {
        color: "gray",
      },
      "& .MuiFormLabel-root.Mui-focused": {
        color: "white",
      },
      "& .MuiInput-underline:after": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiInput-underline:before": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiFormLabel-root.Mui-focused:hover": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
      "& .Mui-disabled": {
        color: "white",
      },
      "& .MuiInputBase-input":{
        color: "white",
      },
      "& .MuiInput-input":{
        color: "white",
      }
    },
    select: {
      "&": {
        color: "gray",
      },
      "&.Mui-focused": {
        color: "white",
      },
      "& .MuiSelect-select": {
        color: "white",
      },
      "&:after": {
        borderBottom: "3px solid #5351B7",
      },
      "&:before": {
        borderBottom: "3px solid #5351B7",
      },
      "& .MuiSvgIcon-root": {
        color: "white",
      },
    },
  };

  const tableAeropuertos =(
    <div className="config-table-container">
      <table className="w-100">
        <thead>
          <tr className="purpleBox">
            <th className="text-center config-table-id">ID</th>
            <th className="text-center">Código</th>
            {/* <th className="text-center">Ciudad</th>
            <th className="text-center">País</th>
            <th className="text-center">Contiente</th> */}
            <th className="text-center">Latitud</th>
            <th className="text-center">Longitud</th>
          </tr>
        </thead>
        <tbody>
          {aeropuertosData != null ? aeropuertosData.map(aeropuerto => {
            return (
              <tr key={aeropuerto.id}>
                <td className="text-end config-table-id">{aeropuerto.id}</td>
                <td className="text-center">{aeropuerto.codigo}</td>
                {/* <td>{aeropuerto.ciudad}</td>
                <td>{aeropuerto.pais}</td>
                <td>{aeropuerto.continente}</td> */}
                <td>{Math.round(aeropuerto.latitud * 1000000) / 1000000}</td>
                <td>{Math.round(aeropuerto.longitud * 1000000) / 1000000}</td>
              </tr>
            );
            })
            :
            <tr>
              <td className="text-center">No hay registros para mostrar</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );

  const aeropuertos = (
    <>
    <div className="col-md-5 p15 h-100">
      <div className="shadowbox grayBox h-100 overflow-hidden">
        <div className="config-title purpleBox">Aeropuertos <PlayArrowIcon style={{transform: "rotate(-90deg)"}}/></div>
        <div className="p15">
          <div className="row">
            <div className="col-md-4 my-auto">Archivo de aeropuertos:</div>
            <div className="col-md-4 my-auto">
              <label className="my-auto fileLabel" htmlFor="aeroFile"><UploadIcon/> Subir archivo</label>
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
          {vuelosData != null ? vuelosData.map(vuelo => {
            return (
              <tr key={vuelo.id}>
                <td className="text-end config-table-id">{vuelo.id}</td>
                <td>{vuelo.aeropuertoPartida.codigo}</td>
                <td>{vuelo.aeropuertoDestino.codigo}</td>
                <td>{(vuelo.fechaPartida).split('T')[1].split('.')[0]}</td>
                <td>{(vuelo.fechaDestino).split('T')[1].split('.')[0]}</td>
                <td>{vuelo.duracion} min</td>
              </tr>
              );
            })
            :
            <tr>
              <td className="text-center">No hay registros para mostrar</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );

  const vuelos = (
    <>
    <div className="col-md-5 p15 h-100">
      <div className="shadowbox grayBox h-100 overflow-hidden">
        <div className="config-title purpleBox">Vuelos diarios <AirplanemodeActiveIcon className="rotate45"/></div>
        <div className="p15">
          <div className="row">
            <div className="col-md-4 my-auto">Archivo de vuelos:</div>
            <div className="col-md-4 my-auto">
              <label className="my-auto fileLabel" htmlFor="vuelosFile"><UploadIcon/> Subir archivo</label>
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

  const reglasNegocio = (
    <>
      <div className="col-md-2 p15 h-100">
        <div className="shadowbox grayBox h-100 position-relative">
          <div className="config-title purpleBox">Reglas de negocio</div>
          <div className="p15">
            <div id="tiempo-envio">
              <div className="row">
                <div className="col ps-0">Tiempo de envio máximo:</div>
              </div>
              <div className="row mt-1">
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Cont"
                    disabled
                    label="Contiental"
                    defaultValue={24}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                  />
                </div>
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Cont"
                    disabled
                    label="Intercontiental"
                    defaultValue={48}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                  />
                </div>
              </div>
            </div>
            <div id="capacidad-almacenes">
              <div className="row mt-5">
                <div className="col ps-0">Capacidad de almacenes:</div>
              </div>
              <div className="row mt-1">
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Intcont"
                    label="América"
                    required
                    value={configuracionesData.CapacidadAeropuertoAmerica.valor}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                    onChange={(e) => {
                      setConfiguracionesData(
                        {...configuracionesData, 
                          CapacidadAeropuertoAmerica: {
                            ...configuracionesData.CapacidadAeropuertoAmerica, 
                            valor: parseInt(e.target.value)
                        }});
                    }}
                  />
                </div>
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Intcont"
                    label="Europa"
                    required
                    value={configuracionesData.CapacidadAeropuertoEuropa.valor}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                    onChange={(e) => {
                      setConfiguracionesData(
                        {...configuracionesData, 
                          CapacidadAeropuertoEuropa: {
                            ...configuracionesData.CapacidadAeropuertoEuropa, 
                            valor: parseInt(e.target.value)
                        }});
                    }}
                  />
                </div>
              </div>
            </div>
            <div id="capacidad-aviones">
              <div className="row mt-5">
                <div className="col ps-0">Capacidad de aviones:</div>
              </div>
              <div className="row mt-1">
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Intcont"
                    label="America"
                    required
                    value={configuracionesData.CapacidadAvionAmerica.valor}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                    onChange={(e) => {
                      setConfiguracionesData(
                        {...configuracionesData, 
                          CapacidadAvionAmerica: {
                            ...configuracionesData.CapacidadAvionAmerica, 
                            valor: parseInt(e.target.value)
                        }});
                    }}
                  />
                </div>
                <div className="col ps-0">
                  <TextField
                    id="max-Vuelo-Intcont"
                    label="Europa"
                    required
                    value={configuracionesData.CapacidadAvionEuropa.valor}
                    variant="standard"
                    type="number"
                    sx={styles.field}
                    onChange={(e) => {
                      setConfiguracionesData(
                        {...configuracionesData, 
                          CapacidadAvionEuropa: {
                            ...configuracionesData.CapacidadAvionEuropa, 
                            valor: parseInt(e.target.value)
                        }});
                    }}
                  />
                </div>
                <div className="row mt-3">
                  <div className="col ps-0">
                    <TextField
                      id="max-Vuelo-Intcont"
                      label="Intecontinentales"
                      required
                      value={configuracionesData.CapacidadAvionInterc.valor}
                      variant="standard"
                      type="number"
                      sx={styles.field}
                      onChange={(e) => {
                        setConfiguracionesData(
                          {...configuracionesData, 
                            CapacidadAvionInterc: {
                              ...configuracionesData.CapacidadAvionInterc, 
                              valor: parseInt(e.target.value)
                          }});
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span 
            className="bottomButton w-100" 
            onClick = {() => {updateConfiguraciones(configuracionesData)}}
          >
            <RedirectButton text="Guardar" icon={<ArrowForwardIosIcon/>}/>
          </span>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    (async () => {
      setAeropuertosData(await getAeropuertos());
    })();
    (async () => {
      setVuelosData(await getVuelos());
    })();
    (async () => {
      setConfiguracionesData(await getConfiguraciones());
    })();
  }, []);

  return(
    <div className="row h-100">
      {aeropuertos}
      {vuelos}
      {reglasNegocio}
    </div>
  );
}

export default Configuracion;