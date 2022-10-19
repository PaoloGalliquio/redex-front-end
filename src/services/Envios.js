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
