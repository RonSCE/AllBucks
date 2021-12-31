import {BaseThunkType, InferActionsTypes} from '../Store';
import {IProduct} from "../../types/types";
import ProductService from "../../api/product-api";
let initialState = {
    currentProduct: null as (IProduct | null),
    products: null as (IProduct[] | null),
    isLoading: false,
    error: '',
};

export enum ProductActions {
    SET_PRODUCT_DATA,
    SET_PRODUCTS_DATA,
    SET_ERROR,
    SET_LOADING
}

const productReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case ProductActions.SET_PRODUCT_DATA:
        case ProductActions.SET_PRODUCTS_DATA:
        case ProductActions.SET_ERROR:
        case ProductActions.SET_LOADING:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const productActions = {
    setProductData: (product:IProduct | null) => ({
        type: ProductActions.SET_PRODUCT_DATA,
        payload: {currentProduct:product}
    } as const),
    setProductsData: (products:IProduct[]) => ({
        type: ProductActions.SET_PRODUCTS_DATA,
        payload: {products}
    } as const),
    setError: (msg: string) => ({
        type: ProductActions.SET_ERROR,
        payload: {error: msg}
    } as const),
    setLoading: (isLoading: boolean) => ({
        type: ProductActions.SET_LOADING,
        payload: {isLoading}
    } as const)
}



export const addProduct = (product: IProduct,img: File): ThunkType => async (dispatch) => {
    try {
        dispatch(productActions.setLoading(true))
        let data = await  ProductService.addProduct(product,img)
        dispatch(productActions.setProductData(data.product))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown product error'
        dispatch(productActions.setError(msg))
    }finally {
        dispatch(productActions.setLoading(false))
    }

}


export const editProduct = (productName:string,product:IProduct,img:File | null): ThunkType => async (dispatch) => {
    try {
        dispatch(productActions.setLoading(true))
        let data = await  ProductService.editProduct(productName,product,img)
        dispatch(productActions.setProductData(data.product))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown product error'
        dispatch(productActions.setError(msg))
    }finally {
        dispatch(productActions.setLoading(false))
    }

}
export const getAllProducts = (): ThunkType => async (dispatch) => {
    try {
        dispatch(productActions.setLoading(true))
        let data = await  ProductService.getAllProducts()
        dispatch(productActions.setProductsData(data.products))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown product error'
        dispatch(productActions.setError(msg))
    }finally {
        dispatch(productActions.setLoading(false))
    }
}

export const getOneProduct = (productName:string): ThunkType => async (dispatch) => {
    try {
        dispatch(productActions.setLoading(true))
        let data = await  ProductService.getOneProduct(productName)
        dispatch(productActions.setProductData(data.product))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown product error'
        dispatch(productActions.setError(msg))
    }finally {
        dispatch(productActions.setLoading(false))
    }

}

export const deleteProduct = (productName:string): ThunkType => async (dispatch) => {
    try {
        dispatch(productActions.setLoading(true))
        await  ProductService.deleteProduct(productName)
        dispatch(productActions.setProductData(null))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown product error'
        dispatch(productActions.setError(msg))
    }finally {
        dispatch(productActions.setLoading(false))
    }

}

export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof productActions>
type ThunkType = BaseThunkType<ActionsType>

export default productReducer;
