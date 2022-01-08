import {BaseThunkType, InferActionsTypes} from '../Store';
import {IOrder, IOrderedProduct} from "../../types/types";
import OrderService from "../../api/order-api";
import AuthService from "../../api/auth-api";
import {authActions} from "./auth-reducer";
let initialState = {
    currentOrder: null as (IOrder | null),
    trackingOrder: null as (IOrder | null),
    orders: null as (IOrder[] | null),
    isLoading: false,
    error: '',
};

export enum OrderActions {
    SET_ORDER_DATA,
    SET_TRACKING_ORDER_DATA,
    SET_ORDERS_DATA,
    SET_ERROR,
    SET_LOADING
}

const orderReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case OrderActions.SET_ORDER_DATA:
        case OrderActions.SET_ORDERS_DATA:
        case OrderActions.SET_ERROR:
        case OrderActions.SET_LOADING:
        case OrderActions.SET_TRACKING_ORDER_DATA:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const orderActions = {
    setOrderData: (order:IOrder) => ({
        type: OrderActions.SET_ORDER_DATA,
        payload: {currentOrder:order}
    } as const),
    setTrackingOrderData: (order:IOrder) => ({
        type: OrderActions.SET_TRACKING_ORDER_DATA,
        payload: {trackingOrder:order}
    } as const),
    setOrdersData: (orders:IOrder[]) => ({
        type: OrderActions.SET_ORDERS_DATA,
        payload: {orders}
    } as const),
    setError: (msg: string) => ({
        type: OrderActions.SET_ERROR,
        payload: {error: msg}
    } as const),
    setLoading: (isLoading: boolean) => ({
        type: OrderActions.SET_LOADING,
        payload: {isLoading}
    } as const)
}

export const loadLocalOrder = (orderedBy:string | undefined | null): ThunkType => async (dispatch) => {
    try {
        let order = localStorage.getItem("localOrder") as string | IOrder
        if(order){
            dispatch(orderActions.setOrderData(JSON.parse(order as string)))
        }else{
            order = {
                orderId:"Unplaced",
                orderedBy:orderedBy?orderedBy:"Guest",
                status:"Unplaced",
                reservedTable:0,
                orderedItems:[]
            }
            dispatch(orderActions.setOrderData(order as IOrder))
        }
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }

}
export const setLocalOrder = (order : IOrder): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setOrderData(order))
        localStorage.setItem("localOrder",JSON.stringify(order))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }

}

export const createOrder = (orderedBy: string,reservedTable:number, orderedItems: IOrderedProduct[]): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        let data = await  OrderService.create(orderedBy,reservedTable,orderedItems)
        dispatch(orderActions.setTrackingOrderData(data.order))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}


export const editStatus = (orderId:string,status:string): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        await  OrderService.editStatus(orderId,status)
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}
export const chargePoints = (cid:string,amount:number): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        await  OrderService.chargePoints(cid,amount)
        const meData = await AuthService.me()
        dispatch(authActions.setAuthUserData(meData.user,true))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}
export const getOrder = (orderId:string): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        let data = await  OrderService.getOrder(orderId)
        dispatch(orderActions.setTrackingOrderData(data.order))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}

export const getActiveOrders = (): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        let data = await  OrderService.getActiveOrders()
        dispatch(orderActions.setOrdersData(data.orders))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}



export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof orderActions | typeof authActions>
type ThunkType = BaseThunkType<ActionsType>

export default orderReducer;
