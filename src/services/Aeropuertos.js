import ajax from "../tools/ajax";

const urlAeropuertos = "/aeropuerto";

export const getAeropuertos = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL + urlAeropuertos + "/list",
  };
  return await ajax(optionsRequest);
};

export const saveAeropuerto = async () => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + urlAeropuertos + "/insert",
  };
  return await ajax(optionsRequest);
};
