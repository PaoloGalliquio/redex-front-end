import ajax from "../tools/ajax";

const url = "/vuelo";

export const getVuelos = async () => {
  const optionsRequest = {
    method: "GET",
    url: process.env.REACT_APP_BACK_UL + url + "/list",
  };
  return await ajax(optionsRequest);
};