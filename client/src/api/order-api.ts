import $api ,{OrderResponse,OrdersResponse,ActionResponse} from "./api"
import {IOrder} from "../types/types";
export default class OrderService {
    static async create(orderedBy: string, orderedItems: IOrder[]) {
        return $api.post<OrderResponse>('/order/create', {orderedBy, orderedItems}).then(res => res.data)
    }
    static async editStatus(orderId:string,status:string){
        return $api.patch<OrderResponse>(`/order/edit-status${orderId}`, {status}).then(res => res.data)
    }
    static async getOrder(orderId:string){
        return $api.get<OrderResponse>(`/order/${orderId}`).then(res => res.data)
    }
    static async getActiveOrders(){
        return $api.get<OrdersResponse>('/order/active').then(res => res.data)
    }
    static async cancelOrder(orderId:string){
        return $api.patch<ActionResponse>(`/order/cancel-order/${orderId}`).then(res => res.data)
    }
    static async edit(orderId:string,orderedItems:IOrder[]){
        return $api.put<OrderResponse>(`/order/edit/${orderId}`, {orderedItems}).then(res => res.data)
    }
}