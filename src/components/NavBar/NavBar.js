import "./NavBar.css"
import { Navbar, Nav } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import brandLogo from "../../logo.svg";
import RedexLogo from "../../images/avionRedex.png";

const NavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  /*const tabs = [
    {
      id: 0,
      text: 'Operaciones Diarias',
      link: '/OperacionesDiarias'
    },
    {
      id: 1,
      text: 'Simulador',
      link: '/Simulador'
    },
    {
      id: 2,
      text: 'Colapso lógístico',
      link: '/ColapsoLogistico'
    },
    {
      id: 3,
      text: 'Configuración',
      link: '/Configuracion'
    },
    {
      id: 4,
      text: 'Nuevo envío',
      link: '/NuevoEnvio'
    }
  ];*/

  const tabs = [
    {
      id: 0,
      text: 'Simulador',
      link: '/Simulador'
    },
    {
      id: 1,
      text: 'Colapso lógístico',
      link: '/ColapsoLogistico'
    },
    {
      id: 2,
      text: 'Configuración',
      link: '/Configuracion'
    }
  ];

  const brand = (
    <div className="row p-0 m-0">
      <div className="col p-0 m-0">
        <img src={RedexLogo} height="80px" width="80px"/>
      </div>
      <div className="col p-2 my-auto">
        <div className="row p-0 m-0">
          <div className="navbar-brand-title col p-0 m-0">
            RedEx
          </div>
        </div>
        <div className="row p-0 m-0">
          <div className="navbar-brand-subtitle col p-0 m-0">
            Paquetería
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const currentPath = "/" + window.location.pathname.split("/")[1];
    const activeItem = tabs.findIndex(
      (tab) => tab.link === currentPath
    );
    setActiveIndex(currentPath.length === 0 ? 0 : activeItem);
  })
  
  return(
    <>
    <Navbar className="navbar shadowBox">
      <Navbar.Brand>
        {brand}
      </Navbar.Brand>
      <Navbar.Collapse>
        {tabs.map((tab) => {
          return (
            <a href={tab.link} key = {tab.id}>
              <Nav>
                <div className="my-auto mx-auto">{tab.text}</div>
                {activeIndex === tab.id ? <div className="navbar-nav-selected"></div> : <></>}
              </Nav>
            </a>
          );
        })}
      </Navbar.Collapse>
    </Navbar>
    </>
  );
}

export default NavBar;