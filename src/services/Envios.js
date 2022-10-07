import ajax from "../tools/ajax";

export const getEnvios = async () => {
  const optionsRequest = {
    method: "GET",
    url: "",
  };
  return await ajax(optionsRequest);
};

export const saveEnvio = async () => {
  const optionsRequest = {
    method: "POST",
    url: "",
  };
  return await ajax(optionsRequest);
};
