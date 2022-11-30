import ajax from "../tools/ajax";

const url = "/configuraciones";

export const getConfiguraciones = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL + url + "/list",
  };
  return await ajax(optionsRequest);
};

export const updateConfiguraciones = async (configuraciones) => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/update",
    data: configuraciones
  };
  return await ajax(optionsRequest);
};
