import axios from 'axios';
import {IOrder, IProduct, ITable, IUser} from "../types/types";

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
export interface TableResponse extends Response{
    table: ITable
}
export interface TablesResponse extends Response{
    tables: ITable[]
}
export interface ProductsResponse extends Response{
    products: IProduct[]
}
export interface ProductResponse extends Response{
    product: IProduct
}
export interface OrderResponse extends Response{
    order: IOrder
}
export interface OrdersResponse extends Response{
    orders: IOrder[]
}
export interface ActionResponse extends Response{
    result: "Success"
}
export interface AuthResponse extends Response{
    accessToken?: string
}
export interface AuthMeResponse extends AuthResponse{
    user:IUser
}

export default $api;