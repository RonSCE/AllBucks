import React from "react";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import Test from "../components/Test";
import StaffRegister from "../components/Auth/StaffRegister";


export interface IRoute {
    path: string;
    component: React.ComponentType;
    exact: boolean;
}

export enum RouteNames {
    LOGIN = '/login',
    REGISTER = '/register',
    HOME = '/home',
    STAFFREG = '/staffregister'
}

export const publicRoutes: IRoute[] = [
    {path: RouteNames.LOGIN, exact: true, component: Login},
    {path: RouteNames.REGISTER, exact: true, component: Register}
]

export const memberRoutes: IRoute[] = [
    {path: RouteNames.HOME, exact: true, component: Test},
]
export const adminRoutes: IRoute[] = [
    {path: RouteNames.HOME, exact: true, component: Test},
    {path: RouteNames.STAFFREG, exact: true, component: StaffRegister},
]
export const baristaRoutes: IRoute[] = [
    {path: RouteNames.HOME, exact: true, component: Test},
]