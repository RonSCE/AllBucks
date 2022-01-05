import React from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import StaffRegister from "../components/Auth/StaffRegister";
import ProductManagement from "../components/AdminManagement/ProductManagement/ProductManagement";
import TableManagement from "../components/AdminManagement/TableManagement/TableManagement";
import ProductList from "../components/HomePage/ProductList";
import Cart from "../components/Cart/Cart";


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
    CART = '/cart'
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: true, component: Login},
    {path: RouteNames.REGISTER, exact: true, component: Register},
    {path: RouteNames.CART, exact: true, component: Cart},
    {path: RouteNames.HOME, exact: true, component: ProductList},
]

export const memberRoutes: IRoute[] = [
    {path: RouteNames.CART, exact: true, component: Cart},
    {path: RouteNames.HOME, exact: true, component: ProductList}
]
export const adminRoutes: IRoute[] = [
    {path: RouteNames.STAFFREG, exact: true, component: StaffRegister},
    {path: RouteNames.PRODUCT_MANAGEMENT, exact: true, component: ProductManagement},
    {path: RouteNames.TABLE_MANAGEMENT, exact: true, component: TableManagement},
    {path: RouteNames.HOME, exact: true, component: ProductManagement}
]
export const baristaRoutes: IRoute[] = [
    {path: RouteNames.HOME, exact: true, component: ProductList}
]