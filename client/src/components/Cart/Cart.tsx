import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {authActions} from '../../redux/reducers/auth-reducer';
import {AppStateType} from "../../redux/Store";
import {Badge, Button, Card, Collapse, Descriptions, InputNumber, Layout, notification, Row, Tooltip} from "antd";
import {IOrder, IOrderedProduct} from "../../types/types";
import {setLocalOrder} from "../../redux/reducers/order-reducer";
import {DeleteOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router-dom';

export const calcRegularPrice = (items: IOrderedProduct[]) => {
    return items.map(i => i.price * i.quantity).reduce((sum, price) => sum + price, 0)
}
export const calcDiscount = (items: IOrderedProduct[]) => {
    return calcRegularPrice(items) - calcFinalPrice(items)
}
export const calcFinalPrice = (items: IOrderedProduct[]) => {
    return items.map(i => i.salePrice ? i.salePrice * i.quantity : i.price * i.quantity).reduce((sum, price) => sum + price, 0)
}
const Cart: React.FC = () => {
    const error = useSelector<AppStateType>(state => state.auth.error) as string
    const currentOrder = useSelector<AppStateType>(state => state.order.currentOrder) as IOrder
    const [editMode, setEditMode] = useState(false)
    const history = useHistory();
    const dispatch = useDispatch()
    const showError = () => {
        if (error) {
            notification.error({
                message: 'Registration error',
                description: error,
                placement: 'topLeft',
                duration: 10,
            });
            dispatch(authActions.setAuthError(''))
        }
    }
    useEffect(showError, [error])
    const onUpdate = () => {
        dispatch(setLocalOrder(currentOrder))
        setEditMode(false)
    }
    const onDelete = (productName: string) => {
        currentOrder.orderedItems = currentOrder.orderedItems.filter(i => i.productName !== productName)
        dispatch(setLocalOrder({...currentOrder}))
    }
    return (
        <Layout>
            <Row justify="center" align="middle" className="h100">
                {editMode ?
                    <Card className="card">
                        <Descriptions
                            title="Cart"
                            bordered
                            column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        >
                            <Descriptions.Item label="Order ID" span={4}>{currentOrder.orderId}</Descriptions.Item>
                            <Descriptions.Item label="Customer" span={4}>{currentOrder.orderedBy}</Descriptions.Item>
                            <Descriptions.Item label="Status" span={4}>
                                <Badge status="processing" text={currentOrder.status}/>
                            </Descriptions.Item>
                        </Descriptions>
                        {currentOrder.orderedItems.length>0 ? currentOrder.orderedItems.map(i =>
                                        <div className={"item-list-cart"} style={{border:"1px solid grey",margin:0}}>
                                            <div className={"item-cart no-border"}><b style={{marginRight: 4}}>Product: </b> {i.productName}</div>
                                            <div className={"item-cart no-border"}><InputNumber className={"cart-input"} defaultValue={i.quantity || 1} min={1} max={1000} onChange={(e) => {
                                                i.quantity = e
                                            }}/></div>
                                            <div className={"item-cart no-border"}>
                                                <Tooltip title="Remove" style={{float: "right"}}>
                                                    <Button type="primary" onClick={() => onDelete(i.productName as string)}
                                                            danger shape="circle" icon={<DeleteOutlined/>}/>
                                                </Tooltip>
                                            </div>
                                        </div>
                        ):
                            <div className={"empty-div"}><h1>Cart is Empty</h1></div>
                        }
                        <Descriptions
                            title="Summary"
                            bordered
                            column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        >
                            <Descriptions.Item
                                label="Amount Before Sale"><b>{calcRegularPrice(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                            <Descriptions.Item
                                label="Discount"><b>{calcDiscount(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                            <Descriptions.Item label="Final Amount"><b>{calcFinalPrice(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                        </Descriptions>
                        <Button type="primary" className={"cart-btn"} onClick={onUpdate}>
                            Save
                        </Button>


                    </Card>

                    :
                    <Card className="card">
                        <Descriptions
                            title="Cart"
                            bordered
                            column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        >
                            <Descriptions.Item label="Order ID" span={4}>{currentOrder.orderId}</Descriptions.Item>
                            <Descriptions.Item label="Customer" span={4}>{currentOrder.orderedBy}</Descriptions.Item>
                            <Descriptions.Item label="Status" span={4}>
                                <Badge status="processing" text={currentOrder.status}/>
                            </Descriptions.Item>
                        </Descriptions>
                        {currentOrder.orderedItems.length>0 ? currentOrder.orderedItems.map((i) =>
                            <>
                                <Collapse accordion>
                                    <Collapse.Panel
                                        header={<><b style={{marginRight: 4}}>Product: </b> {i.productName}</>} key={i.productName}>
                                        <div className={"item-list-cart"}>
                                            <div className={"item-cart"}><b>Quantity: </b>{i.quantity} </div>
                                            <div className={"item-cart"}><b>Regular Price: </b> {i.price}₪</div>
                                            <div className={"item-cart"}><b>Sale
                                                Price: </b>{i.salePrice ? i.salePrice + '₪' : "None"}</div>
                                        </div>
                                    </Collapse.Panel>
                                </Collapse>
                            </>
                        ):
                            <div className={"empty-div"}><h1>Cart is Empty</h1></div>

                        }
                        <Descriptions
                            title="Summary"
                            bordered
                            column={{xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1}}
                        >
                            <Descriptions.Item
                                label="Amount Before Sale"><b>{calcRegularPrice(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                            <Descriptions.Item
                                label="Discount"><b>{calcDiscount(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                            <Descriptions.Item label="Final Amount"><b>{calcFinalPrice(currentOrder.orderedItems)}₪</b></Descriptions.Item>
                        </Descriptions>
                        <Button disabled={currentOrder.orderedItems.length <1} type="primary" className={"cart-btn"} onClick={() => {history.push("/checkout");}}>
                            Check Out
                        </Button>
                        <Button disabled={currentOrder.orderedItems.length <1} type="primary" className={"cart-btn"} onClick={() => setEditMode(true)}>
                            Edit Cart
                        </Button>

                    </Card>}

            </Row>
        </Layout>
    );
};

export default Cart;