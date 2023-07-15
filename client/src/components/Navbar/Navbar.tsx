import Loader from '../Loader/Loader';
import { useAppSelector } from '../../hooks/redux';
import { NavLink, useNavigate } from "react-router-dom";
import BasketImage from '../../assets/Basket.png'
import ExitImage from '../../assets/Exit.png'
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { authApiUser } from '../../services/authService';
import { useEffect} from 'react';


import './Navbar.css'
import { BASKET_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../../utils/consts';
export interface INavbar{
    title:string,
    loading:boolean
}

export const NavbarHeight = 65;


const NavBar = ({title, loading}:INavbar) => {
    const {isAuth} = useAppSelector(state=> state.userReducer);
    const navigate = useNavigate();
    const [triggerLogout, resultLogout] = authApiUser.useLogoutMutation();
    useEffect(()=>{
        if(resultLogout.isSuccess) {
            navigate("/");
        }
    }, [resultLogout.isSuccess])
    return (
        <div className='NavBar' >
            <div className='NavBar__content'>
                <h1 className='NavBar__title'><NavLink to={SHOP_ROUTE}>{title}</NavLink></h1>
                {   loading || resultLogout.isLoading ? <Loader h={40} w={40}/>
                    : isAuth ? 
                        <div className='NavBarProfile'>
                           <NavLink to={BASKET_ROUTE}><div className='Navbar__basket-img' style={{backgroundImage:`url(${BasketImage})`}}></div></NavLink>
                           <div className='Navbar__exit-img' onClick={e=>{
                                triggerLogout();

                           }} style={{backgroundImage:`url(${ExitImage})`}}></div>
                           <ProfileMenu/>
                     </div>
                    :
                    <NavLink className='NavBar__link' to={REGISTRATION_ROUTE}>Авторизация</NavLink>
                }
                
            </div>
        </div>
    );
};

export default NavBar;