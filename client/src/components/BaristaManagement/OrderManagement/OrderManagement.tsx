import React, {useEffect} from 'react';
import {Button, List, Skeleton} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../../redux/Store";
import {IOrder} from "../../../types/types";
import {completeOrder, getActiveOrders, getOrder} from "../../../redux/reducers/order-reducer";
import {SyncOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";

const OrderManagement = () => {
    const orders = useSelector<AppStateType>(state => state.order.orders) as IOrder []
    const isLoading = useSelector<AppStateType>(state => state.order.isLoading) as boolean
    const dispatch = useDispatch()
    const history = useHistory()
    const onToTracker = (orderId:string) => {
        dispatch(getOrder(orderId))
        history.push('/tracking')
    }
    const onComplete = (orderId:string)=> {
        dispatch(completeOrder(orderId))
    }
    useEffect(()=>{
        dispatch(getActiveOrders())
    }
    ,[])
    return (
        <div>
            { orders &&
            <List
                className="item-list"
                loading={isLoading}
                dataSource={orders}
                renderItem=
                    {order => (
                    <List.Item  style={{borderBottom:"2px solid grey"}} className={"order-item"}
                                actions={[<a className={"edit-item"} onClick={()=>onComplete(order.orderId)}>Order completed</a>,
                                ]}
                    >
                        <Skeleton avatar title={false} loading={isLoading} active>
                            <List.Item.Meta
                                title={<b>Order # {order.orderId}</b> }
                                description={
                                    <div>
                                        <div><a className={"edit-item"} onClick={()=>onToTracker(order.orderId)}><b>See Full Order in Order Tracker</b></a></div>
                                        <div><b>Customer: </b>{order.orderedBy}</div>
                                        <div><b>Status: </b>{order.status}</div>
                                        <div><b>Reserved Table: </b>{order.reservedTable ? order.reservedTable : 'Take Away'}</div>
                                    </div>
                                }
                            />
                        </Skeleton>
                    </List.Item>

                )}
            />}
            <Button className={"add-prod-bnt"} type="primary" shape="round" icon={<SyncOutlined />} size={"large"}
                    onClick={()=>dispatch(getActiveOrders())}>
                Refresh
            </Button>
        </div>
    );
};

export default OrderManagement;