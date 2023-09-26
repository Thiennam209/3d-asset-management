import axios from 'axios'

const urlApi = "https://aka-reality.info/api/"
export const urlStrapi = "https://aka-reality.info"
 //sEPNs5kDTKonk0imjvw1bQNrcxbFrN
export const tokenSketchfab = "Bearer sEPNs5kDTKonk0imjvw1bQNrcxbFrN"

export const http = axios.create({
    baseURL: urlApi,
});