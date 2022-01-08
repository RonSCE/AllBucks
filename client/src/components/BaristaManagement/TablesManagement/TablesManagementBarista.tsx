import React, {useEffect} from 'react';
import {Button, List, Skeleton} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/Store";
import {getAllTables, releaseTable, reserveTable} from "../../../redux/reducers/table-reducer";
import {ITable} from "../../../types/types";
import {SyncOutlined} from "@ant-design/icons";


const TablesManagementBarista = () => {
    const tables = useSelector<AppStateType>(state=>state.table.tables) as ITable[]
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getAllTables())
    },[])
    const isLoading = useSelector<AppStateType>(state=>state.table.isLoading) as boolean
    const onRelease = (num:number) => {
        dispatch(releaseTable(num))
    }
    const onReserve = (num:number) => {
        dispatch(reserveTable(num))
    }
    return (
        <>
            { tables &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={tables}
                renderItem={table => (
                    <List.Item  style={{borderBottom:"2px solid grey"}} className={"table-item"}
                                actions={[
                                    <>{table.isAvailable?
                                        <a className={"reserve"} onClick={()=>{onReserve(table.tableNum)}}><b>Reserve</b></a>
                                    :
                                        <a className={"release"} onClick={()=>{onRelease(table.tableNum)}}><b>Release</b></a>
                                }

                                    </>
                                    ,]}
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
            <Button className={"add-prod-bnt"} type="primary" shape="round" icon={<SyncOutlined />} size={"large"}
                    onClick={()=>dispatch(getAllTables())}>
                Refresh
            </Button>
        </>
    );
};

export default TablesManagementBarista;