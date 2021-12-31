import {BaseThunkType, InferActionsTypes} from '../Store';
import {IOrder} from "../../types/types";
import OrderService from "../../api/order-api";
let initialState = {
    currentOrder: null as (IOrder | null),
    orders: null as (IOrder[] | null),
    isLoading: false,
    error: '',
};

export enum OrderActions {
    SET_ORDER_DATA,
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



export const createOrder = (orderedBy: string, orderedItems: IOrder[]): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        let data = await  OrderService.create(orderedBy,orderedItems)
        dispatch(orderActions.setOrderData(data.order))
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
        let data = await  OrderService.editStatus(orderId,status)
        dispatch(orderActions.setOrderData(data.order))
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
        dispatch(orderActions.setOrderData(data.order))
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

export const cancelOrder = (orderId:string): ThunkType => async (dispatch) => {
    try {
        //TODO:think about implementation
        dispatch(orderActions.setLoading(true))
        await OrderService.cancelOrder(orderId)
        let order = initialState.currentOrder as IOrder
        order.status = 'Cancelled'
        dispatch(orderActions.setOrderData(order))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}
export const editOrder = (orderId:string,orderedItems:IOrder[]): ThunkType => async (dispatch) => {
    try {
        dispatch(orderActions.setLoading(true))
        let data = await  OrderService.edit(orderId,orderedItems)
        dispatch(orderActions.setOrderData(data.order))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown order error'
        dispatch(orderActions.setError(msg))
    }finally {
        dispatch(orderActions.setLoading(false))
    }

}
export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof orderActions>
type ThunkType = BaseThunkType<ActionsType>

export default orderReducer;
