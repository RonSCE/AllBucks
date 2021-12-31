import $api ,{TableResponse,TablesResponse,ActionResponse} from "./api"
import {ITable} from "../types/types";
export default class TableService {
    static async addTable(table:ITable) {
        return $api.post<TableResponse>('/table/add', {...table}).then(res => res.data)
    }
    static async reserveTable(tableNum:number){
        return $api.post<ActionResponse>(`/table/reserve/${tableNum}`).then(res => res.data)
    }
    static async releaseTable(tableNum:number){
        return $api.post<ActionResponse>(`/table/release/${tableNum}`).then(res => res.data)
    }
    static async getTable(tableNum:number){
        return $api.get<TableResponse>(`/table/${tableNum}`).then(res => res.data)
    }
    static async getAllTables(){
        return $api.get<TablesResponse>(`/table/`).then(res => res.data)
    }
    static async editTable(tableNum:number,capacity:number,isAvailable:boolean,isInside:boolean){
        return $api.put<TableResponse>(`/table/edit/${tableNum}`,{capacity,isAvailable,isInside}).then(res => res.data)
    }
    static async deleteTable(tableNum:number){
        return $api.delete<ActionResponse>(`/table/delete/${tableNum}`).then(res => res.data)
    }
}