import axios from 'axios';
import {IUser} from "../types/types";

export const API_URL = `https://localhost:5000/api`

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})
$api.interceptors.request.use(async (config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config;
})

export interface Response{
    message?:string
    errors?: any[]
}
export interface AuthResponse extends Response{
    accessToken?: string
}
export interface AuthMeResponse extends AuthResponse{
    user:IUser
}

export default $api;