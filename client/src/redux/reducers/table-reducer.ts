import {BaseThunkType, InferActionsTypes} from '../Store';
import {ITable} from "../../types/types";
import TableService from "../../api/table-api";
let initialState = {
    currentTable: null as (ITable | null),
    tables: null as (ITable[] | null),
    isLoading: false,
    error: '',
};

export enum TableActions {
    SET_TABLE_DATA,
    SET_TABLES_DATA,
    SET_ERROR,
    SET_LOADING
}

const tableReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case TableActions.SET_TABLE_DATA:
        case TableActions.SET_TABLES_DATA:
        case TableActions.SET_ERROR:
        case TableActions.SET_LOADING:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}

export const tableActions = {
    setTableData: (table:ITable | null) => ({
        type: TableActions.SET_TABLE_DATA,
        payload: {currentTable:table}
    } as const),
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
    } as const)
}



export const addTable = (table:ITable): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        let data = await  TableService.addTable(table)
        dispatch(tableActions.setTableData(data.table))
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
        let table = initialState.currentTable as ITable
        table.isAvailable = false
        dispatch(tableActions.setTableData(table))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const releaseTable = (tableNum:number): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        await TableService.releaseTable(tableNum)
        let table = initialState.currentTable as ITable
        table.isAvailable = true
        dispatch(tableActions.setTableData(table))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
        dispatch(tableActions.setError(msg))
    }finally {
        dispatch(tableActions.setLoading(false))
    }

}
export const getTable = (tableNum:number): ThunkType => async (dispatch) => {
    try {
        dispatch(tableActions.setLoading(true))
        let data = await TableService.getTable(tableNum)
        dispatch(tableActions.setTableData(data.table))
    } catch (e: any) {
        const msg = e.response?.data?.message || 'Unknown table error'
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
        let data = await TableService.editTable(tableNum,capacity,isAvailable,isInside)
        dispatch(tableActions.setTableData(data.table))
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
        dispatch(tableActions.setTableData(null))
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
