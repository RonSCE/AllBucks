import React from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import StaffRegister from "../components/Auth/StaffRegister";
import ProductManagement from "../components/AdminManagement/ProductManagement/ProductManagement";
import TableManagement from "../components/AdminManagement/TableManagement/TableManagement";
import ProductList from "../components/HomePage/ProductList";
import Cart from "../components/Cart/Cart";
import Checkout from "../components/Checkout/Checkout";
import OrderTracker from "../components/OrderTracker/OrderTracker";
import OrderManagement from "../components/BaristaManagement/OrderManagement/OrderManagement";
import TablesManagementBarista from "../components/BaristaManagement/TablesManagement/TablesManagementBarista";


export interface IRoute {
    path: string;
    component: React.ComponentType;
    exact: boolean;
}

export enum RouteNames {
    LOGIN = '/login',
    REGISTER = '/register',
    HOME = '/',
    STAFFREG = '/staffregister',
    PRODUCT_MANAGEMENT= '/product-management',
    TABLE_MANAGEMENT = '/table-management',
    CART = '/cart',
    CHECKOUT = '/checkout',
    TRACKING = '/tracking',
    ORDER_MANAGEMENT = '/order-management'
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: true, component: Login},
    {path: RouteNames.REGISTER, exact: true, component: Register},
    {path: RouteNames.CART, exact: true, component: Cart},
    {path: RouteNames.CHECKOUT, exact: true, component: Checkout},
    {path: RouteNames.TRACKING, exact: true, component: OrderTracker},
    {path: RouteNames.HOME, exact: true, component: ProductList},

]

export const memberRoutes: IRoute[] = [
    {path: RouteNames.CHECKOUT, exact: true, component: Checkout},
    {path: RouteNames.CART, exact: true, component: Cart},
    {path: RouteNames.TRACKING, exact: true, component: OrderTracker},
    {path: RouteNames.HOME, exact: true, component: ProductList}
]
export const adminRoutes: IRoute[] = [
    {path: RouteNames.STAFFREG, exact: true, component: StaffRegister},
    {path: RouteNames.PRODUCT_MANAGEMENT, exact: true, component: ProductManagement},
    {path: RouteNames.TABLE_MANAGEMENT, exact: true, component: TableManagement},
    {path: RouteNames.HOME, exact: true, component: ProductManagement}
]

export const baristaRoutes: IRoute[] = [
    {path: RouteNames.TRACKING, exact: true, component: OrderTracker},
    {path: RouteNames.CART, exact: true, component: Cart},
    {path: RouteNames.CHECKOUT, exact: true, component: Checkout},
    {path: RouteNames.ORDER_MANAGEMENT, exact: true, component: OrderManagement},
    {path: RouteNames.TABLE_MANAGEMENT, exact: true, component: TablesManagementBarista},
    {path: RouteNames.HOME, exact: true, component: ProductList}
]