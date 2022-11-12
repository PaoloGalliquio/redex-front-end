import ajax from "../tools/ajax";

const url = "/simulator";

export const simulatorInitial = async (file) => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/initial",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  };
  return await ajax(optionsRequest);
}

export const simulatorPerBlock = async (blockNumber) => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/perBlock",
    params: {
      block: blockNumber
    }
  };
  return await ajax(optionsRequest);
}