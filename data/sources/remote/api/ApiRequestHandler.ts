import axios from "axios";

const ApiRequestHandler = axios.create({
baseURL:"http://192.168.0.127:3000",
  headers:{
    'Content-Type': 'application/json'
  }

});

export{ApiRequestHandler}