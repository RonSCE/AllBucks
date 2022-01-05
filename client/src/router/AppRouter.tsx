import {Switch , Route, Redirect } from "react-router-dom";
import {adminRoutes, baristaRoutes, memberRoutes, publicRoutes, RouteNames} from "./routes";
import {useSelector} from "react-redux";
import {AppStateType} from "../redux/Store";



export const AppRouter = () => {
    const isAuth = useSelector<AppStateType>(state => state.auth.isAuth) as boolean
    const type = useSelector<AppStateType>(state => state.auth.user?.type) as string
    const isLoading = useSelector<AppStateType>(state => state.app.isLoading) as boolean
    return (
        isAuth && !isLoading && type==="Member"?
            <Switch>
                {memberRoutes.map(route =>
                    <Route path={route.path}
                           exact={route.exact}
                           component={route.component}
                           key={route.path}
                    />
                )}
                <Redirect to={RouteNames.HOME}/>

            </Switch>
            :
            isAuth && !isLoading && type==="Barista"?
                <Switch>
                    {baristaRoutes.map(route =>
                        <Route path={route.path}
                               component={route.component}
                               key={route.path}
                        />
                    )}
                    <Redirect to={RouteNames.HOME}/>
                </Switch>
                :
                isAuth && !isLoading && type==="Admin"  ?
                    <Switch>
                        {adminRoutes.map(route =>
                            <Route path={route.path}
                                   component={route.component}
                                   key={route.path}
                            />
                        )}
                        <Redirect to={RouteNames.HOME}/>
                    </Switch>
                    :
            <Switch>
                {publicRoutes.map(route =>
                    <Route path={route.path}
                           component={route.component}
                           key={route.path}
                    />
                )}
                <Redirect to={RouteNames.HOME}/>
            </Switch>
    );
};