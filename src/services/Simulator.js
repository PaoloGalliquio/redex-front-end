import ajax from "../tools/ajax";

const url = "/simulator";

export const simulatorInitialDay = async (file) => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/initialDay",
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: file
  };
  return await ajax(optionsRequest);
}

export const simulatorPerDay = async (indexParameter) => {
  const optionsRequest = {
    method: "POST",
    url: process.env.REACT_APP_BACK_UL + url + "/perDay",
    index: indexParameter
  };
  return await ajax(optionsRequest);
}