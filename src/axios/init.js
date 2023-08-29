import axios from 'axios'

const urlApi = "http://20.119.54.193:1337/api/"

export const http = axios.create({
    baseURL: urlApi,
});