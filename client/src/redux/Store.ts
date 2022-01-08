import {Action, applyMiddleware, combineReducers, compose, createStore} from "redux";
import thunk, {ThunkAction} from "redux-thunk";
import authReducer from "./reducers/auth-reducer";
import appReducer from "./reducers/app-reducer";
import orderReducer from "./reducers/order-reducer";
import productReducer from "./reducers/product-reducer";
import tableReducer from "./reducers/table-reducer";



let rootReducer = combineReducers({
    auth:authReducer,
    app:appReducer,
    order:orderReducer,
    product:productReducer,
    table:tableReducer,
})

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>

export type InferActionsTypes<T> = T extends { [keys: string]: (...args: any[]) => infer U } ? U : never

export type BaseThunkType<A extends Action = Action, R = Promise<void>> = ThunkAction<R, AppStateType, unknown, A>
export type AppDispatch = typeof store.dispatch

const composeEnhancers = compose
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
// @ts-ignore
window.__store__ = store
export default store