import "./NuevoEnvio.css";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddIcon from "@mui/icons-material/Add";
import UploadIcon from "@mui/icons-material/Upload";
import { useEffect } from "react";

const NuevoEnvio = () => {
  const notifyError = (mensaje) => toast.error(mensaje);
  const notifySuccess = (mensaje) => toast.success(mensaje);
  const [loading, setLoading] = useState(true);
  const [paquetes, setPaquetes] = useState(0);
  const [fechaSalida, setFechaSalida] = useState(Date().toLocaleString());
  const [paisOrigen, setPaisOrigen] = useState(null);
  const [ciudadOrigen, setCiudadOrigen] = useState(null);
  const [aeropuertoOrigen, setAeropuertoOrigen] = useState(null);
  const [paisDestino, setPaisDestino] = useState(null);
  const [ciudadDestino, setCiudadDestino] = useState(null);
  const [aeropuertoDestino, setAeropuertoDestino] = useState(null);

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

  const data = [
    {
      id: 1,
      nombre: "Perú",
      ciudades: [
        {
          id: 1,
          nombre: "Lima",
          aeropuertos: [
            {
              id: 1,
              nombre: "Aeropuerto de Lima 1",
            },
            {
              id: 2,
              nombre: "Aeropuerto de Lima 2",
            },
          ],
        },
        {
          id: 2,
          nombre: "Arequipa",
          aeropuertos: [
            {
              id: 3,
              nombre: "Aeropuerto de Arequipa 1",
            },
            {
              id: 4,
              nombre: "Aeropuerto de Arequipa 2",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      nombre: "Colombia",
      ciudades: [
        {
          id: 3,
          nombre: "Bogotá",
          aeropuertos: [
            {
              id: 5,
              nombre: "Aeropuerto de Bogotá 1",
            },
            {
              id: 6,
              nombre: "Aeropuerto de Bogotá 2",
            },
          ],
        },
        {
          id: 4,
          nombre: "Medellín",
          aeropuertos: [
            {
              id: 7,
              nombre: "Aeropuerto de Medellín 1",
            },
            {
              id: 8,
              nombre: "Aeropuerto de Medellín 2",
            },
          ],
        },
      ],
    },
  ];

  const headerTable = [
    {
      id: 0,
      name: "Código",
    },
    {
      id: 1,
      name: "Carga",
    },
    {
      id: 2,
      name: "Origen",
    },
    {
      id: 3,
      name: "Destino",
    },
    {
      id: 4,
      name: "Hora de salida",
    },
    {
      id: 5,
      name: "Hora de llegada",
    },
    {
      id: 6,
      name: "Tiempo recorrido",
    },
  ];

  const envios = [
    {
      id: 90584,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90585,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90586,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90587,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
    {
      id: 90588,
      carga: "320",
      origen: "Lima - Perú",
      detino: "Moscú - Rusia",
      horaSalida: "05:55 PM",
      horaLlegada: "11:10 PM",
      tiempoRecorrido: "02:05",
    },
  ];

  const paquetesCom = (
    <>
      <div className="col my-auto">Cantidad de paquetes*:</div>
      <div className="col my-auto">
        <TextField
          id="cantPaquetes"
          label="Numero de paquetes"
          required
          variant="standard"
          type="number"
          sx={styles.field}
          onChange={(e) => {
            setPaquetes(e.target.value);
          }}
        />
      </div>
    </>
  );

  const fechaCom = (
    <>
      <div className="col my-auto">Fecha de salida*:</div>
      <div className="col my-auto">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Date desktop"
            inputFormat="DD/MM/YYYY"
            value={fechaSalida}
            onChange={(e) => {
              setFechaSalida(e.$d);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={styles.field}
                variant="standard"
                required
              />
            )}
          />
        </LocalizationProvider>
      </div>
    </>
  );

  const paisOrigenCom = (
    <>
      <div className="col-md-4 my-auto">País de origen*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required id="select-pais">
            País
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoOrigen(null);
              setCiudadOrigen(null);
              setPaisOrigen(
                data.find((pais) => {
                  return pais.id == e.target.value;
                })
              );
            }}>
            {data ? (
              data.map((pais) => {
                return (
                  <MenuItem value={pais.id} key={pais.id}>
                    {pais.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const ciudadOrigenCom = (
    <>
      <div className="col-md-4 my-auto">Ciudad de origen*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required>
            Ciudad
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoOrigen(null);
              setCiudadOrigen(e.target.value);
            }}>
            {paisOrigen ? (
              paisOrigen.ciudades.map((ciudad) => {
                return (
                  <MenuItem value={ciudad} key={ciudad.id}>
                    {ciudad.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const aeropuertoOrigenCom = (
    <>
      <div className="col-md-4 my-auto">Aeropuerto de origen*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required>
            Aeropuerto
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoOrigen(e.target.value);
            }}>
            {paisOrigen && ciudadOrigen ? (
              ciudadOrigen.aeropuertos.map((aeropuerto) => {
                return (
                  <MenuItem value={aeropuerto} key={aeropuerto.id}>
                    {aeropuerto.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const paisDestinoCom = (
    <>
      <div className="col-md-4 my-auto">País de destino*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required>
            País
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoDestino(null);
              setCiudadDestino(null);
              setPaisDestino(
                data.find((pais) => {
                  return pais.id == e.target.value;
                })
              );
            }}>
            {data ? (
              data.map((pais) => {
                return (
                  <MenuItem value={pais.id} key={pais.id}>
                    {pais.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const ciudadDestinoCom = (
    <>
      <div className="col-md-4 my-auto">Ciudad de destino*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required>
            Ciudad
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoDestino(null);
              setCiudadDestino(e.target.value);
            }}>
            {paisDestino ? (
              paisDestino.ciudades.map((ciudad) => {
                return (
                  <MenuItem value={ciudad} key={ciudad.id}>
                    {ciudad.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const aeropuertoDestinoCom = (
    <>
      <div className="col-md-4 my-auto">Aeropuerto de destino*:</div>
      <div className="col-md-8 my-auto">
        <FormControl fullWidth variant="standard">
          <InputLabel sx={styles.select} required>
            Aeropuerto
          </InputLabel>
          <Select
            fullWidth
            defaultValue=""
            required
            sx={styles.select}
            onChange={(e) => {
              setAeropuertoDestino(e.target.value);
            }}>
            {paisDestino && ciudadDestino ? (
              ciudadDestino.aeropuertos.map((aeropuerto) => {
                return (
                  <MenuItem value={aeropuerto} key={aeropuerto.id}>
                    {aeropuerto.nombre}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>Seleccionar</MenuItem>
            )}
          </Select>
        </FormControl>
      </div>
    </>
  );

  const registroDeEnvio = (
    <div className="col-md-6 ps-0 pe-0 h-100 nuevoEnvio-Container">
      <div className="row">
        <div className="col-md-4 my-auto ps-0 pe-0">
          <a href="/OperacionesDiarias">
            <div className="purpleBox nuevoEnvio-Tittle">
              <ArrowBackIosNewIcon className="nuevoEnvio-IconLeft" />
              Regresar
            </div>
          </a>
        </div>
        <div className="col-md-4"></div>
        <div className="col-md-4 my-auto text-end ps-0 pe-0">
          <div className="purpleBox nuevoEnvio-Tittle">
            Subir archivo
            <UploadIcon className="nuevoEnvio-Icon" />
          </div>
        </div>
      </div>
      <div className="row mt-4 w-50">
        <div className="col purpleBox nuevoEnvio-Tittle">Detalle de envío</div>
      </div>
      <div className="row mt-2">
        {paquetesCom}
        {fechaCom}
      </div>
      <div className="row mt-4 w-50">
        <div className="col purpleBox nuevoEnvio-Tittle">Punto de origen</div>
      </div>
      <div className="row mt-2">{paisOrigenCom}</div>
      <div className="row mt-2">{ciudadOrigenCom}</div>
      <div className="row mt-2">{aeropuertoOrigenCom}</div>
      <div className="row mt-4 w-50">
        <div className="col purpleBox nuevoEnvio-Tittle">Punto de destino</div>
      </div>
      <div className="row mt-2">{paisDestinoCom}</div>
      <div className="row mt-2">{ciudadDestinoCom}</div>
      <div className="row mt-2">{aeropuertoDestinoCom}</div>
      <div className="row mb-auto nuevoEnvio-Footer w-100">
        <div className="col-md-6 my-auto pe-0">(*) Campo obligatorio</div>
        <div className="col-md-2"></div>
        <div className="col-md-4 my-auto text-end ps-0 pe-0">
          <div
            className="pointer"
            onClick={() => {
              registrarEnvio();
            }}>
            <div className="purpleBox nuevoEnvio-Tittle">
              Registrar envío
              <AddIcon className="nuevoEnvio-Icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tablaEnvios = (
    <>
      <div className="col-md-6 p15 pt-0 pb-0">
        <div className="opdia-table-container h-100">
          <table className="w-100 h-100">
            <thead>
              <tr className="purpleBox">
                {headerTable.map((header) => {
                  return (
                    <th key={header.id} className="text-center">
                      {header.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {envios.map((envio) => {
                return (
                  <tr key={envio.id}>
                    <td>{envio.id}</td>
                    <td>{envio.carga} paquetes</td>
                    <td>{envio.origen}</td>
                    <td>{envio.detino}</td>
                    <td className="text-center">{envio.horaSalida}</td>
                    <td className="text-center">{envio.horaLlegada}</td>
                    <td className="text-center">{envio.tiempoRecorrido}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );

  const estaCompleto = () => {
    if (paquetes == 0) {
      notifyError("Ingrese la cantidad de paquetes");
      return false;
    }
    if (fechaSalida == null) {
      notifyError("Ingrese la fecha de salida");
      return false;
    }
    if (paisOrigen == null) {
      notifyError("Seleccione un país de origen");
      return false;
    }
    if (ciudadOrigen == null) {
      notifyError("Seleccione una ciudad de origen");
      return false;
    }
    if (aeropuertoOrigen == null) {
      notifyError("Seleccione un aeropuerto de origen");
      return false;
    }
    if (paisDestino == null) {
      notifyError("Seleccione un país de destino");
      return false;
    }
    if (ciudadDestino == null) {
      notifyError("Seleccione una ciudad de destino");
      return false;
    }
    if (aeropuertoDestino == null) {
      notifyError("Seleccione un aeropuerto de destino");
      return false;
    }
    return true;
  };

  const registrarEnvio = () => {
    if (!estaCompleto()) return;
    setLoading(true);
    envios.push({
      id: 90589,
      carga: paquetes,
      origen: ciudadOrigen.nombre + " - " + paisOrigen.nombre,
      detino: ciudadDestino.nombre + " - " + paisDestino.nombre,
      horaSalida: fechaSalida,
      horaLlegada: "Calculando...",
      tiempoRecorrido: "00:00",
    });
    console.log(envios);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    notifySuccess("Se ha registrado el nuevo envío");
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [envios]);

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="row h-100">
        <div className="col-md-12 p15 h-100">
          <div className="grayBox shadowBox p15 h-100 opdia-relative">
            <div className="row h-100">
              {registroDeEnvio}
              {loading ? <></> : tablaEnvios}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NuevoEnvio;
