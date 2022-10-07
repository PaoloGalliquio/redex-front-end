import ajax from "../tools/ajax";

export const getEnvios = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL,
  };
  return await ajax(optionsRequest);
};

export const saveEnvio = async () => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL,
  };
  return await ajax(optionsRequest);
};
