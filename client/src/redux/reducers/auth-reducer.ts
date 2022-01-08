import AuthService from "../../api/auth-api"
import {BaseThunkType, InferActionsTypes} from '../Store';
import {IUser} from "../../types/types";
import {appActions} from "./app-reducer";
import {loadLocalOrder} from "./order-reducer";
let initialState = {
    user: null as (IUser | null),
    isAuth: false,
    error: '',
};

export enum AuthActions {
    SET_USER_DATA,
    LOGOUT,
    SET_AUTH_ERROR
}

const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case AuthActions.SET_USER_DATA:
        case AuthActions.SET_AUTH_ERROR:
        case AuthActions.LOGOUT:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const authActions = {

    setAuthUserData: (user:IUser,isAuth:boolean) => ({
        type: AuthActions.SET_USER_DATA, payload: {user, isAuth}
    } as const),
    logout: () => ({
        type: AuthActions.LOGOUT,
        payload: {user: null, isAuth: false}
    } as const),
    setAuthError: (msg: string) => ({
        type: AuthActions.SET_AUTH_ERROR,
        payload: {error: msg}
    } as const),
}

export const getAuthUserData = (): ThunkTypeAuth => async (dispatch) => {
    try {
        if (localStorage.getItem('accessToken')) {
            let meData = await AuthService.me()
            dispatch(authActions.setAuthUserData(meData.user,true))
        }
    }catch (e) {
        console.log(e);
    }
}

export const login = (email: string, password: string): ThunkTypeAuth => async (dispatch) => {
    try {
        dispatch(appActions.setLoading(true))
        let data = await AuthService.login(email, password);
        const accessToken = data.accessToken || ''
        localStorage.setItem('accessToken', accessToken)
        let meData
        if (localStorage.getItem('accessToken')) {
            meData = await AuthService.me()
            dispatch(authActions.setAuthUserData(meData.user,true))
        }
        localStorage.removeItem("localOrder")
        await dispatch(loadLocalOrder(meData?.user.name || undefined))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Incorrect login or password'
        dispatch(authActions.setAuthError(msg))
    }finally {
        dispatch(appActions.setLoading(false))
    }

}
export const logout = ():ThunkTypeAuth => async (dispatch ) => {
    localStorage.removeItem("accessToken")
    dispatch(authActions.logout())
    localStorage.removeItem("localOrder")
    await dispatch(loadLocalOrder(undefined))
}
export const register = (email: string, password: string,name:string): ThunkTypeAuth => async (dispatch) => {
    try {
        dispatch(appActions.setLoading(true))
        let data = await AuthService.register(email, password,name);
        const accessToken = data.accessToken as string
        localStorage.setItem('accessToken', accessToken)
        await dispatch(getAuthUserData())
    }catch (e:any) {
        const msg = e.response?.data?.message || 'Unknown registration error'
        dispatch(authActions.setAuthError(msg))
    }finally {
        dispatch(appActions.setLoading(false))
    }

}
export const staffRegister = (email: string, password: string,name:string,type:string): ThunkTypeAuth => async (dispatch) => {
    try {
        dispatch(appActions.setLoading(true))
        await AuthService.staffRegister(email, password,name,type);
    }catch (e:any) {
        const msg = e.response?.data?.message || 'Unknown registration error'
        dispatch(authActions.setAuthError(msg))
    }finally {
        dispatch(appActions.setLoading(false))
    }

}



export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof authActions | typeof appActions>
type ThunkTypeAuth = BaseThunkType<ActionsType>

export default authReducer;
