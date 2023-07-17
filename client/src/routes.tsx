import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Basket from "./pages/Basket";
import DevicePage from "./pages/DevicePage";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import { ADMIN_ROUTE, BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from "./utils/consts";

interface routes{
    path:string,
    element:JSX.Element
}
export const authRoutes:routes[] = [
    {
        path:ADMIN_ROUTE,
        element:<Admin/>
    },
    {
        path:BASKET_ROUTE,
        element: <Basket/>
    }
]

export const publicRoutes = [
    {
        path:SHOP_ROUTE,
        element:<Shop/>
    },
    {
        path:DEVICE_ROUTE + '/:id',
        element: <DevicePage/>
    },
    {
        path:REGISTRATION_ROUTE,
        element:<Auth/>
    },
    {
        path:LOGIN_ROUTE,
        element: <Auth/>
    },
    {
        path:'*',
        element: <NotFound/>
    }
]