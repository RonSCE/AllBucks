import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom'
import {IOrder, IUser, userTypes} from '../../types/types';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from '../../redux/Store';
import {Badge, Button, Input, Layout, Menu, notification, Tooltip} from "antd";
import {
    AimOutlined,
    CaretDownOutlined,
    CloseOutlined,
    DollarCircleOutlined,
    FormOutlined,
    GatewayOutlined,
    HomeOutlined,
    LoginOutlined,
    LogoutOutlined,
    QuestionOutlined,
    SearchOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    UserAddOutlined,
    UsergroupAddOutlined,
    UserOutlined
} from "@ant-design/icons";
import SubMenu from 'antd/lib/menu/SubMenu';
import {logout} from "../../redux/reducers/auth-reducer";
import {getUser, orderActions} from "../../redux/reducers/order-reducer";


const Navbar: React.FC = () => {
    const dispatch = useDispatch()
    const currentOrder = useSelector<AppStateType>(state => state.order.currentOrder ) as IOrder
    const user = useSelector<AppStateType>(state => state.auth.user ) as IUser
    const customer = useSelector<AppStateType>(state => state.order.currentCustomer) as IUser
    const error = useSelector<AppStateType>(state => state.order.error) as string
    const [userInput,setUserInput] = useState("")
    const onSearch = ()=>{
        dispatch(getUser(userInput))
    }
    useEffect(()=> {
            if(error){
                notification.error({
                    message: 'Error',
                    description: error,
                    placement: 'topLeft',
                    duration: 7,
                });
                dispatch(orderActions.setError(''))
        }
    },[error])
    const isAuth = useSelector<AppStateType>(state => state.auth.isAuth ) as boolean
    const onLogout = () => {
        dispatch(logout())
    }
    return (
        <Layout.Header className={"header minWidth"}>
            {isAuth && user.type===userTypes.Admin ?

                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="cart"><Link to="">
                        <ShoppingCartOutlined/> <Badge count={currentOrder&& currentOrder.orderedItems.length || 0} />
                    </Link></Menu.Item>
                    <Menu.Item key="home"><Link to="/"><HomeOutlined /> Home</Link></Menu.Item>
                    <SubMenu key="sub-menu-user" icon={<UserOutlined/>}
                             title={<>{user?.name || 'unknown'  } <CaretDownOutlined/></>}>
                        <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined/>}> Logout</Menu.Item>
                        <Menu.Item key="type" icon={<QuestionOutlined />}> {user.type}</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="stafreg"><Link to="/staffregister"><UsergroupAddOutlined/> Register Staff</Link></Menu.Item>
                    <Menu.Item key="prod-management"> <Link to="/product-management"><ShopOutlined /> Product Management</Link></Menu.Item>
                    <Menu.Item key="table-management"> <Link to="/table-management"><GatewayOutlined /> Table Management</Link></Menu.Item>
                </Menu>
                :isAuth && user.type===userTypes.Member?
                    <Menu theme="dark" mode="horizontal">
                        <Menu.Item key="cart"><Link to="/cart">
                            <ShoppingCartOutlined/> <Badge count={   currentOrder&& currentOrder.orderedItems.length || 0 } />
                        </Link></Menu.Item>
                        <SubMenu key="sub-menu-user" icon={<UserOutlined/>}
                                 title={<>{user?.name || 'unknown'  } <CaretDownOutlined/></>}>
                            <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined/>}> Logout</Menu.Item>
                            <Menu.Item key="type" icon={<QuestionOutlined />}> {user.type}</Menu.Item>
                            <Menu.Item key="points" icon={<DollarCircleOutlined /> }>Member Points: {user.points || 0}</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="home"><Link to="/"><HomeOutlined /> Home</Link></Menu.Item>
                        <Menu.Item key="tracking"><Link to="/tracking"><AimOutlined /> Order Tracking</Link></Menu.Item>
                    </Menu>
                    :isAuth && user.type===userTypes.Barista?
                        <Menu theme="dark" mode="horizontal">
                            <Menu.Item key="cart"><Link to="/cart">
                                <ShoppingCartOutlined/> <Badge count={currentOrder&& currentOrder.orderedItems.length || 0 } />
                            </Link></Menu.Item>
                            <SubMenu key="sub-menu-user" icon={<UserOutlined/>}
                                     title={<>{user?.name || 'unknown'  } <CaretDownOutlined/></>}>
                                <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined/>}> Logout</Menu.Item>
                                <Menu.Item key="type" icon={<QuestionOutlined />}> {user.type}</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="home"><Link to="/"><HomeOutlined /> Home</Link></Menu.Item>
                            <Menu.Item key="order-management"><Link to="/order-management"><FormOutlined /> Order Management</Link></Menu.Item>
                            <Menu.Item key="table-management"><Link to="/table-management"><GatewayOutlined /> Table Management</Link></Menu.Item>
                            <Menu.Item key="tracking"><Link to="/tracking"><AimOutlined /> Order Tracking</Link></Menu.Item>
                                {customer ?
                                    <li key={"1"}>
                                        <b>Customer:</b>{customer.name }   <b style={{marginLeft:15}}>Points:</b>{customer.points }
                                        <Tooltip title="Clear customer">
                                            <Button onClick={()=>dispatch(orderActions.setCustomer(null))}
                                                size={"small"} style={{marginTop:20,marginLeft:5}} shape="circle" icon={<CloseOutlined />} />
                                        </Tooltip>
                                    </li>
                                    :
                                    <li key={"1"}>
                                        <Input  placeholder={"Club Member"} style={{width:125}} allowClear value={userInput} onChange={(e) => setUserInput(e.target.value)}/>
                                        <Tooltip title="search">
                                        <Button style={{marginTop:15,marginLeft:5}} onClick={onSearch} shape="circle" icon={<SearchOutlined />} />
                                        </Tooltip>
                                    </li>
                                }

                        </Menu>

                        :
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="cart"><Link to="/cart">
                        <ShoppingCartOutlined/> <Badge count={   currentOrder&& currentOrder.orderedItems.length || 0 } />
                    </Link></Menu.Item>
                    <Menu.Item key="home"><Link to="/"><HomeOutlined /> Home</Link></Menu.Item>
                    <Menu.Item key="tracking"><Link to="/tracking"><AimOutlined /> Order Tracking</Link></Menu.Item>
                    <Menu.Item key="login"><Link to="/login"><LoginOutlined/> Login</Link></Menu.Item>
                    <Menu.Item key="register"> <Link to="/register"><UserAddOutlined/> Register</Link></Menu.Item>
                </Menu>
            }
        </Layout.Header>
    );
}

export default Navbar;