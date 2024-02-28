import axios from 'axios'

const urlApi = "https://holy-nature-3713b08069.strapiapp.com/api/"
export const urlStrapi = "https://holy-nature-3713b08069.strapiapp.com"
// //sEPNs5kDTKonk0imjvw1bQNrcxbFrN
// export const tokenSketchfab = "Bearer Bu7HZJoHN31HqWqYDNN9hEOyTT1zDS"

export const http = axios.create({
    baseURL: urlApi,
});
