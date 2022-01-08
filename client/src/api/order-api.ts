import $api, {OrderResponse, OrdersResponse, ActionResponse, AuthMeResponse} from "./api"
import { IOrderedProduct} from "../types/types";
export default class OrderService {
    static async create(orderedBy: string,reservedTable: number, orderedItems: IOrderedProduct[],cid:string) {
        return $api.post<OrderResponse>('/order/create', {orderedBy,reservedTable, orderedItems,cid}).then(res => res.data)
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
    static async chargePoints(cid:string,amount:number){
        return $api.patch<ActionResponse>(`/order/charge-points/${cid}`,{amount}).then(res => res.data)
    }
    static async getUser(cid:string){
        return $api.get<AuthMeResponse>(`/order/user/${cid}`).then(res => res.data)
    }
    static async completeOrder(orderId:string){
        return $api.patch<ActionResponse>(`/order/complete-order/${orderId}`).then(res => res.data)
    }
}
