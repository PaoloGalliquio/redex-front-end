import ajax from "../tools/ajax";

const url = "/aeropuerto";

export const getAeropuertos = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL + url + "/list",
  };
  return await ajax(optionsRequest);
};

export const saveAeropuerto = async () => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/insert",
  };
  return await ajax(optionsRequest);
};
