import axios from "axios";

const ajax = async (options) =>
  await axios.request(options).then((response) => response.data);

export default ajax;
