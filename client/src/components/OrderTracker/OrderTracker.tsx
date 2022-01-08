import React, {FC, useState} from 'react';
import {Badge, Button, Card, Descriptions, Input, Layout, message, Row, Tooltip} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/Store";
import {IOrder} from "../../types/types";
import {SearchOutlined} from '@ant-design/icons';
import {getOrder} from "../../redux/reducers/order-reducer";

const OrderTracker:FC = () => {
    const order = useSelector<AppStateType>(state=>state.order.trackingOrder) as IOrder
    const [orderId,setOrderId] = useState(order?.orderId || "")
    const dispatch = useDispatch()
    const onSearch = ()=> {
        if(orderId.length === 24){
            dispatch(getOrder(orderId))
        }
       else{
           message.error("Order ID length should be 24 symbols!")
        }
    }
    return (
        <Layout>
            <div className={"search"} style={{marginTop:22}}>
                <Input placeholder={"Enter Order ID"} style={{width:250}} value={orderId} onChange={(e)=>setOrderId(e.target.value)}/>
                <Tooltip title="Search Order by ID">
                    <Button  onClick={onSearch} style={{marginLeft:15}} type="primary" shape="circle" icon={<SearchOutlined />} />
                </Tooltip>
            </div>
            <Row justify="center" align="middle" className="h100">

        {order ?
                <Card className="card">
            <Descriptions
                title="Order"
                bordered
                column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
            >
                <Descriptions.Item label="Order ID" span={4}>{order.orderId}</Descriptions.Item>
                <Descriptions.Item label="Table reserved" span={4}>{order.reservedTable?order.reservedTable:"Take Away"}</Descriptions.Item>
                <Descriptions.Item label="Customer" span={4}>{order.orderedBy}</Descriptions.Item>
                <Descriptions.Item label="Status" span={4}>
                    <Badge status="processing" text={order.status}/>
                </Descriptions.Item>
            </Descriptions>
                    <div className={"empty-div"}><h1>Ordered Items</h1></div>
                    {

                        order.orderedItems.map(i=>
                            <div className={"desc-items"}><b>{i.productName} x {i.quantity}</b></div>
                        )
                    }
        </Card>
        :
         <>
             <div>
                 <br/>
                 <h1>No Order Found</h1>
             </div>

         </>

        }
            </Row>
        </Layout>
    );
};

export default OrderTracker;