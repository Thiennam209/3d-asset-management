import axios from 'axios'

const urlApi = "https://aka-reality.info/api/"
export const urlStrapi = "https://aka-reality.info"
// //sEPNs5kDTKonk0imjvw1bQNrcxbFrN
// export const tokenSketchfab = "Bearer Bu7HZJoHN31HqWqYDNN9hEOyTT1zDS"

export const http = axios.create({
    baseURL: urlApi,
});
