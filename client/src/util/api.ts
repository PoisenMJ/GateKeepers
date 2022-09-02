import config, { environments } from "../config"

function getAPIEndpoint(path?: string) {
  return config[process.env.REACT_APP_ENV as environments].BACKEND_URI + path;
}

export { getAPIEndpoint };