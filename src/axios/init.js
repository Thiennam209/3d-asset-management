import axios from 'axios'

const urlApi = "https://aka-reality.info/api/"
export const urlStrapi = "https://aka-reality.info"

export const http = axios.create({
    baseURL: urlApi,
});