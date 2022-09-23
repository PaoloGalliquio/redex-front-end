import "./CardShipping.css"

const CardShipping = (props) => {
  const envio = props.envio;

  return(
    <>
    <div className="purpleBox cardShip-envio-title">Envío {envio.id}</div>
    <div className="blackBox cardShip-envio-container p10">
      <div>Carga: {envio.carga}</div>
      <div>Origen: {envio.origen}</div>
      <div>Destino: {envio.detino}</div>
      <div>Hora de salida: {envio.horaSalida}</div>
      <div>Hora de salida: {envio.horaLlegada}</div>
      <div>Tiempo recorrido: {envio.tiempoRecorrido}</div>
    </div>
    </>
  );
}

export default CardShipping;