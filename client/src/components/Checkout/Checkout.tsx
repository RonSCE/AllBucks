import React, {FC, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../redux/Store";
import {IOrder, ITable, IUser} from "../../types/types";
import {Redirect} from "react-router-dom";
import Card from 'react-credit-card-flipping';
import {Button, Descriptions, Input, InputNumber, List, message, notification, Popconfirm, Steps, Tooltip} from "antd";
import {getAllTables, tableActions} from "../../redux/reducers/table-reducer";
import TableService from "../../api/table-api";
import {calcDiscount, calcFinalPrice, calcRegularPrice} from "../Cart/Cart";
import {QuestionCircleOutlined} from "@ant-design/icons";
import {chargePoints, createOrder, loadLocalOrder} from "../../redux/reducers/order-reducer";

const { Step } = Steps;


const Checkout:FC = () => {
    const dispatch = useDispatch()
    const regNumber = new RegExp('^[0-9]{1,16}?$');
    const regNumber3 = new RegExp('^[0-9]{1,3}?$')
    const regNumber4 = new RegExp('^[0-9]{1,4}?$')
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCVV, setCardCVV] = useState('');
    const [focusCVV, setFocusCVV] = useState(false);
    const order = useSelector<AppStateType>(state=>state.order.currentOrder) as IOrder
    const finalPrice = calcFinalPrice(order.orderedItems)
    const user = useSelector<AppStateType>(state=>state.auth.user) as IUser
    const customer = useSelector<AppStateType>(state=>state.order.currentCustomer) as IUser
    const isMember = user && user.type === "Member"
    const selected = useSelector<AppStateType>(state => state.table.selected) as number
    useEffect(()=>{
        dispatch(getAllTables())
    },[])
    const onReserve = async (num: number) => {
        try{
            await TableService.reserveTable(num)
            dispatch(tableActions.setSelected(num))
        }catch (e) {
            notification.error({
                message: 'Error',
                description: 'Table is already reserved',
                placement: 'topLeft',
                duration: 7,
            });
            dispatch(getAllTables())
        }

    }
    const onRelease = async (num: number) => {
        try{
            await TableService.releaseTable(num)
            dispatch(tableActions.setSelected(0))
        }catch (e) {
            notification.error({
                message: 'Error',
                description: 'Table is already free',
                placement: 'topLeft',
                duration: 7,
            });
            dispatch(getAllTables())
        }
    }
    const [takeAway,setTakeAway] = useState(false)
    const [spentPoints,setSpentPoints] = useState(0)
    const [payedWithCash,setPayedWithCash]= useState(0)
    const tables = useSelector<AppStateType>(state => state.table.tables) as ITable []
    const steps = [
        {
            title: 'Sit in or Take Away',
            content:<div>
                <h2 style={{textAlign:"center"}}>Sit in or Take Away?</h2>
                <br/>
                <div className={"margin-auto"}>
                    <Button className={"big-btn"} type="primary" shape="round" size={"large"}   danger={takeAway}
                            onClick={()=>{setTakeAway(true);setStep(2);} }>
                        Take Away
                    </Button>
                    <Button className={"big-btn"} type="primary" shape="round"  size={"large"}  style={{marginLeft:50}} danger={!takeAway}
                            onClick={()=>{setTakeAway(false);setStep(1);}}>
                        Sit in
                    </Button>
                </div>

            </div>,
        },
        {
            title: 'Choose your Table',
            content:
                <>
                    <Button style={{marginTop:15}} onClick={()=>dispatch(getAllTables())}>Refresh</Button>
                <List
                    className="item-list"
                    dataSource={tables}
                    renderItem={table => (
                        <List.Item  style={selected=== table.tableNum?{borderBottom:"2px solid red"}:{borderBottom:"2px solid grey"}} className={"table-item"}
                                    actions={[
                                        <>{ table.tableNum === selected ?
                                            <Popconfirm title="Are you sure?" okText="Yes" cancelText="No"
                                                        onConfirm={() => onRelease(table.tableNum as number)}>
                                                <Button type="primary" shape="round" size={"small"}>
                                                    Release
                                                </Button>
                                            </Popconfirm>
                                            :
                                            <Popconfirm title="To change table after, you will need to release this one first!" okText="Continue" cancelText="No" onConfirm={()=>onReserve(table.tableNum as number)}>
                                            <Button disabled={!table.isAvailable || selected >0} type="primary"
                                            shape="round" size={"small"} > Reserve</Button>
                                            </Popconfirm>
                                        }
                                        </>
                                    ]}
                        >
                                <List.Item.Meta
                                    title={<b>Table # {table.tableNum}</b>}
                                    description={
                                        <div>
                                            <div><b>Capacity: </b>{table.capacity}</div>
                                            <div><b>Location: </b>{table.isInside ? "Inside" : 'Outside'}</div>
                                        </div>
                                    }
                                />
                        </List.Item>

                    )}
                /> </>
        },
        {
            title: 'Payment',
            content: <>
                <Descriptions title="Summary" bordered >
                    <Descriptions.Item style={{border:"1px solid grey"}}
                                       label="Amount Before Sale">{calcRegularPrice(order.orderedItems)}₪</Descriptions.Item>
                    <Descriptions.Item style={{border:"1px solid grey"}}
                                       label="Discount">{calcDiscount(order.orderedItems)}₪</Descriptions.Item>
                    <Descriptions.Item style={{border:"1px solid grey"}} label="Final Amount"><b>{finalPrice}₪</b></Descriptions.Item>
                </Descriptions>
                { isMember && user.points &&
                    <>

                        <Tooltip placement="topRight" title="1 point = 1₪">
                            <b>Member Points: {user.points || 0}</b> <QuestionCircleOutlined />
                        </Tooltip>
                        <div>
                           <b> Pay with Member Points: </b>
                            <InputNumber value={spentPoints} onChange={(e)=>setSpentPoints(e)}
                                min={0} max={Math.min(user.points ,finalPrice)}/>
                            <Tooltip placement="topRight" title="If set to 0, no points will be charged">
                            <QuestionCircleOutlined />
                           </Tooltip>
                        </div>
                        </>
                }
                { user && user.type==="Barista" && customer && customer.points && customer.points > 0 &&
                    <>

                <Tooltip placement="topRight" title="1 point = 1₪">
                    <b>Member Points: {customer.points}</b> <QuestionCircleOutlined />
                    </Tooltip>
                    <div>
                    <b> Pay with Member Points: </b>
                    <InputNumber value={spentPoints} onChange={(e)=>setSpentPoints(e)}
                    min={0} max={Math.min(customer.points ,finalPrice-payedWithCash)}/>
                    <Tooltip placement="topRight" title="If set to 0, no points will be charged">
                    <QuestionCircleOutlined />
                    </Tooltip>
                    </div>
                    </>
                }
                {user?.type === "Barista" &&
                <>
                    <div style={{marginTop:10}}>
                        <b> Pay with CASH : </b>
                        <InputNumber value={payedWithCash} onChange={(e)=>setPayedWithCash(e)}
                                     min={0} max={finalPrice-spentPoints}/>
                    </div>
                </>
                }
                {finalPrice-spentPoints-payedWithCash !== 0 &&
                <div className={"credit-card"}>
                    <div className={'ccard-item'}>
                        <Card
                            number={cardNumber}
                            name={cardName}
                            expiry={cardExpiry}
                            cvv={cardCVV}
                            flipCard={focusCVV}
                        />
                    </div>
                    <div className={'ccard-item cc-inputs'}>
                        <form >
                            <Input
                                className={'cc-input'}
                                type={"tel"}
                                value={cardNumber}
                                inputMode={"decimal"}
                                name="number"
                                placeholder="Card Number"
                                onChange={(event) => {
                                    if(regNumber.test(event.target.value) || event.target.value===""){
                                        setCardNumber(event.target.value)
                                    }
                                }}
                            />
                            <br/>
                            <Input
                                className={'cc-input'}
                                type="tel"
                                name="cvv"
                                value={cardCVV}
                                placeholder="CVV"
                                onChange={(event) => {
                                    if(regNumber3.test(event.target.value)  || event.target.value===""){
                                        setCardCVV(event.target.value)
                                    }
                                }}
                                onFocus={() => setFocusCVV(true)}
                                onBlur={() => setFocusCVV(false)}
                            />
                            <br/>
                            <Input
                                className={'cc-input'}
                                type="tel"
                                name="date"
                                value={cardExpiry}
                                placeholder="Expiry"
                                onChange={(event) => {
                                    if(regNumber4.test(event.target.value) || event.target.value===""){
                                        setCardExpiry(event.target.value)
                                    }
                                }}
                            />
                            <br/>
                            <Input
                                className={'cc-input'}
                                name="name"
                                value={cardName}
                                placeholder="Card Owner"
                                onChange={(event) => setCardName(event.target.value)}
                            />
                        </form>
                    </div>
                </div>}
            </>,
        },
    ];
    const [current, setCurrent] = useState(0);
    const [step, setStep] = useState(1);
    const onPay = ()=> {
        if(finalPrice-spentPoints-payedWithCash===0 || regNumber.test(cardNumber) && regNumber3.test(cardCVV) && regNumber4.test(cardExpiry) && cardName){
            if(spentPoints>0){
                if(isMember){
                    dispatch(chargePoints(user.cid as string,spentPoints,false))
                }else if(customer){
                    dispatch(chargePoints(customer.cid as string,spentPoints,true))
                }

            }
            let cid;
            if(user&& user.type ==="Barista" && customer){
                cid = customer.cid
            }else if(isMember){
                cid = user.cid
            }else{
                cid = "Guest"
            }
            let customerName;
            if(user&& user.type ==="Barista" && customer){
                customerName = customer.name
            }else if(user&& user.type ==="Barista" && !customer){
                customerName = "Guest"
            }
            else if(isMember){
                customerName = user.name
            }else{
                customerName = "Guest"
            }
            dispatch(createOrder(customerName as string,selected,order.orderedItems,cid as string))
            localStorage.removeItem("localOrder")
            dispatch(loadLocalOrder(user?.name || "Guest"))
            message.success('Payment Accepted')
        }else{
            message.error('Please fill the form fully');
        }
    }
    const next = () => {
        setCurrent(current + step);
    };

    const prev = () => {
        setCurrent(current - step);
    };
    if(!order || order.orderedItems.length<1){
        return <Redirect to={"/tracking"}/>
    }
    return (
        <div className={"steps"} style={{marginTop:25}}>
            <Steps current={current} >
                {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className={"step"} >{steps[current].content}</div>
            <div className="">
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (


                    <Popconfirm title={isMember?
                        <>
                        <div><b>Total Points Spent:</b>{spentPoints}</div>
                        <div><b>Total Cash Spent (with credit card):</b>{finalPrice-spentPoints}₪</div>
                        </>
                        :user && user.type === "Barista"?
                        <>
                        {customer && customer.points && customer.points>0 &&
                        <div><b>Total Points Spent:</b>{spentPoints}</div>}
                        <div><b>Total Cash Spent:</b>{payedWithCash}₪</div>
                        <div><b>Total Cash Spent (with credit card):</b>{finalPrice-spentPoints-payedWithCash}₪</div>
                        </>
                            :
                            <>
                                <div><b>Total Cash Spent (with credit card):</b>{finalPrice}₪</div>
                            </>

                       }
                                okText="Confirm" cancelText="Cancel"
                    onConfirm={onPay}>
                        <Button type="primary" >
                            Pay
                        </Button>
                    </Popconfirm>
                )}
                {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                        Previous
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Checkout;