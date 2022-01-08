import React from 'react';
import {Link} from 'react-router-dom'
import {IOrder, IUser, userTypes} from '../../types/types';
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from '../../redux/Store';
import {Badge, Layout, Menu} from "antd";
import {
    AimOutlined,
    CaretDownOutlined, DollarCircleOutlined,
    GatewayOutlined,
    HomeOutlined,
    LoginOutlined,
    LogoutOutlined,
    QuestionOutlined, ShopOutlined, ShoppingCartOutlined,
    UserAddOutlined, UsergroupAddOutlined,
    UserOutlined
} from "@ant-design/icons";
import SubMenu from 'antd/lib/menu/SubMenu';
import {logout} from "../../redux/reducers/auth-reducer";


const Navbar: React.FC = () => {
    const dispatch = useDispatch()
    const currentOrder = useSelector<AppStateType>(state => state.order.currentOrder ) as IOrder
    const user = useSelector<AppStateType>(state => state.auth.user ) as IUser
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
                                <ShoppingCartOutlined/> <Badge count={   currentOrder&& currentOrder.orderedItems.length || 0 } />
                            </Link></Menu.Item>
                            <SubMenu key="sub-menu-user" icon={<UserOutlined/>}
                                     title={<>{user?.name || 'unknown'  } <CaretDownOutlined/></>}>
                                <Menu.Item key="logout" onClick={onLogout} icon={<LogoutOutlined/>}> Logout</Menu.Item>
                                <Menu.Item key="type" icon={<QuestionOutlined />}> {user.type}</Menu.Item>
                            </SubMenu>
                            <Menu.Item key="home"><Link to="/"><HomeOutlined /> Home</Link></Menu.Item>
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