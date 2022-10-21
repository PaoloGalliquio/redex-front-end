import ajax from "../tools/ajax";

const url = "/envio";

export const getEnvios = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL + url + "/list",
  };
  return await ajax(optionsRequest);
};

export const saveEnvio = async () => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/insert",
  };
  return await ajax(optionsRequest);
};

export const sendFile = async (file) => {
  const optionsRequest = {
    method: "POST",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: {
      envios: file
    },
    url: process.env.REACT_APP_BACK_UL + url + "/sendFile",
  };
  return await ajax(optionsRequest);
}