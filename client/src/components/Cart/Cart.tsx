import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authActions} from '../../redux/reducers/auth-reducer';
import {AppStateType} from "../../redux/Store";
import {Badge, Button, Card, Descriptions, InputNumber, Layout, notification, Row, Tooltip} from "antd";
import {IOrder} from "../../types/types";
import {setLocalOrder} from "../../redux/reducers/order-reducer";
import {DeleteOutlined} from '@ant-design/icons';


const Cart:React.FC = () => {
    const error = useSelector<AppStateType>(state => state.auth.error) as string
    const currentOrder = useSelector<AppStateType>(state => state.order.currentOrder) as IOrder
    const [editMode,setEditMode] = useState(false)
    const dispatch = useDispatch()
    const showError = () => {
        if(error) {
            notification.error({
                message: 'Registration error',
                description: error,
                placement: 'topLeft',
                duration: 10,
            });
            dispatch(authActions.setAuthError(''))
        }
    }
    useEffect(showError,[error])
    const onUpdate = () => {
        dispatch(setLocalOrder(currentOrder))
        setEditMode(false)
    }
    const onDelete = (productName:string) => {
        currentOrder.orderedItems = currentOrder.orderedItems.filter(i=> i.productName !== productName)
        dispatch(setLocalOrder({...currentOrder}))
    }
    return (
        <Layout>
            <Row justify="center" align="middle" className="h100">
                {editMode ?
                    <Card className="card" >
                        <Descriptions
                            title="Responsive Descriptions"
                            bordered
                            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                        >
                            <Descriptions.Item label="Customer" span={4}>{currentOrder.orderedBy}</Descriptions.Item>
                            <Descriptions.Item label="Status" span={4}>
                                <Badge status="processing" text={currentOrder.status} />
                            </Descriptions.Item>

                            {currentOrder.orderedItems.map(i =>
                                <>
                                    <Descriptions.Item label={"Product:"}> {i.productName} </Descriptions.Item>
                                    <Descriptions.Item label={"Quantity:"}>
                                        <InputNumber className={"cart-input"} defaultValue={i.quantity || 1} min={1} max={1000} onChange={(e)=>{i.quantity = e  }} />
                                        <Tooltip title="Remove">
                                            <Button type="primary" onClick={()=>onDelete(i.productName as string)} danger shape="circle" icon={<DeleteOutlined />} />
                                        </Tooltip>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={"Regular Price:"}> {i.price}</Descriptions.Item>
                                    <Descriptions.Item label={"Sale Price:"}> {i.salePrice? i.salePrice : "None"}</Descriptions.Item>
                                </>
                            )}
                            <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
                            <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                            <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
                        </Descriptions>
                        <Button type="primary" className={"cart-btn"} onClick={onUpdate}>
                            Update
                        </Button>
                        <Button type="primary" className={"cart-btn"} onClick={()=>setEditMode(false)}>
                            Cancel
                        </Button>
                    </Card>


                :
                <Card className="card" >
                    <Descriptions
                        title="Responsive Descriptions"
                        bordered
                        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                    >
                        <Descriptions.Item label="Customer" span={4}>{currentOrder.orderedBy}</Descriptions.Item>
                        <Descriptions.Item label="Status" span={4}>
                            <Badge status="processing" text={currentOrder.status} />
                        </Descriptions.Item>

                        {currentOrder.orderedItems.map(i =>
                            <>
                            <Descriptions.Item label={"Product:"}> {i.productName} </Descriptions.Item>
                            <Descriptions.Item label={"Quantity:"}>{i.quantity} </Descriptions.Item>
                            <Descriptions.Item label={"Regular Price:"}> {i.price}</Descriptions.Item>
                            <Descriptions.Item label={"Sale Price:"}> {i.salePrice? i.salePrice : "None"}</Descriptions.Item>
                            </>
                        )}
                        <Descriptions.Item label="Negotiated Amount">$80.00</Descriptions.Item>
                        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                        <Descriptions.Item label="Official Receipts">$60.00</Descriptions.Item>
                    </Descriptions>
                    <Button type="primary" className={"cart-btn"} onClick={()=> {}}>
                        Check Out
                    </Button>
                    <Button type="primary" className={"cart-btn"} onClick={()=>setEditMode(true)}>
                        Edit Order
                    </Button>
                </Card>}

            </Row>
        </Layout>
    );
};

export default Cart;