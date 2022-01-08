import {BaseThunkType, InferActionsTypes} from '../Store';
import {ITable} from "../../types/types";
import TableService from "../../api/table-api";
let initialState = {
    selected: 0,
    tables: null as (ITable[] | null),
    isLoading: false,
    error: '',
};

export enum TableActions {
    SET_TABLES_DATA,
    SET_ERROR,
    SET_LOADING,
    SET_SELECTED
}

const tableReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case TableActions.SET_TABLES_DATA:
        case TableActions.SET_ERROR:
        case TableActions.SET_LOADING:
        case TableActions.SET_SELECTED:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const tableActions = {
    setTablesData: (tables:ITable[]) => ({
        type: TableActions.SET_TABLES_DATA,
        payload: {tables}
    } as const),
    setError: (msg: string) => ({
        type: TableActions.SET_ERROR,
        payload: {error: msg}
    } as const),
    setLoading: (isLoading: boolean) => ({
        type: TableActions.SET_LOADING,
        payload: {isLoading}
    } as const),
    setSelected: (num: number) => ({
        type: TableActions.SET_SELECTED,
        payload: {selected:num}
    } as const)
}



export const addTable = (table:ITable): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        await TableService.addTable(table)
        let data = await TableService.getAllTables()
        dispatch(tableActions.setTablesData(data.tables))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}

export const reserveTable = (tableNum:number): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        await TableService.reserveTable(tableNum)
    } catch (e: any) {
        console.log(e);
        const msg = e.response?.data?.message || 'Reserve table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const releaseTable = (tableNum:number): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        await TableService.releaseTable(tableNum)
    } catch (e: any) {
        console.log(e);
        const msg = e.response?.data?.message || 'Release table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const getAllTables = (): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        let data = await TableService.getAllTables()
        dispatch(tableActions.setTablesData(data.tables))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const editTable = (tableNum:number,capacity:number,isAvailable:boolean,isInside:boolean): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
       await TableService.editTable(tableNum,capacity,isAvailable,isInside)
        let data = await TableService.getAllTables()
        dispatch(tableActions.setTablesData(data.tables))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const deleteTable = (tableNum:number): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        await TableService.deleteTable(tableNum)
        let data = await TableService.getAllTables()
        dispatch(tableActions.setTablesData(data.tables))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}


export type InitialStateType = typeof initialState
type ActionsType = InferActionsTypes<typeof tableActions>
type ThunkType = BaseThunkType<ActionsType>

export default tableReducer;
