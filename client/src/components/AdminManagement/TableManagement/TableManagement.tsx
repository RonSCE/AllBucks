import React, {FC, useEffect, useState} from 'react';
import {Button, List, Popconfirm, Skeleton} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/Store";
import {ITable} from "../../../types/types";
import {PlusCircleOutlined} from "@ant-design/icons";
import {addTable, deleteTable, editTable, getAllTables} from "../../../redux/reducers/table-reducer";
import ModalTableInput from "./Actions/ModalTableInput";

const TableManagement:FC = () => {
    const dispatch = useDispatch()
    const allTables = useSelector<AppStateType>(state=>state.table.tables) as ITable[]
    const [isEditing,setEditing]= useState(false)
    const [isAdding,setAdding] = useState(false)
    const [tables,setTables] = useState(allTables || [] as ITable[])
    const [table,setTable] = useState<ITable | null>(null)
    useEffect(()=>{
        dispatch(getAllTables())
        setTables(allTables)
    },[])
    useEffect(()=>{
        setTables(allTables)
    },[allTables])
    const isLoading = useSelector<AppStateType>(state=>state.table.isLoading)  as boolean
    const onOk =(table: ITable) => {
        dispatch(editTable(table.tableNum as number,table.capacity as number,table.isAvailable as boolean,table.isInside as boolean))
        setEditing(false)
    }
    const onAdd = (table: ITable) => {
        dispatch(addTable(table))
        setAdding(false)
    }
    const onEdit = (table:ITable)=> {
        setTable(table)
        setEditing(true)
    }
    const onDelete = (tableNum: number)=>{
        dispatch(deleteTable(tableNum))
    }

    return (
        <>
            { tables &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={tables}
                renderItem={table => (
                    <List.Item className={"item"}
                               actions={[<a className={"edit-item"} onClick={()=>{onEdit(table)}}>Edit</a>,
                                   <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>{onDelete(table.tableNum as number)}}>
                                       <a className={"delete-item"} >Delete</a>
                                   </Popconfirm>
                               ]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                            <List.Item.Meta
                                title={<b>Table # {table.tableNum}</b>}
                                description={
                                    <div>
                                        <div><b>Capacity: </b>{table.capacity}</div>
                                        <div><b>Is Available: </b>{table.isAvailable ? "Yes": "No"}</div>
                                        <div><b>Is Inside: </b>{table.isInside ? "Yes" : 'No'}</div>
                                    </div>
                                }
                            />

                        </Skeleton>
                    </List.Item>

                )}

            />

            }
            <Button className={"add-prod-bnt"} type="primary" shape="round" icon={<PlusCircleOutlined />} size={"large"}
                    onClick={()=>setAdding(true)}>
                Add
            </Button>
            <ModalTableInput visible={isEditing} setVisible={setEditing} onOk={onOk} isLoading={isLoading} table={table} setTable={setTable} />
            <ModalTableInput visible={isAdding} setVisible={setAdding} onOk={onAdd} isLoading={isLoading} table={null} setTable={()=>{}} />
        </>
    );
};

export default TableManagement;