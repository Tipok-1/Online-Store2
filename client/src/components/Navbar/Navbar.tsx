import Loader from '../Loader/Loader';
import { useAppSelector } from '../../hooks/redux';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import ProfileMenu from '../ProfileMenu/ProfileMenu';
import { authApiUser } from '../../services/authService';
import { useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Box from '@mui/material/Box';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Badge from '@mui/material/Badge';
import './Navbar.css'
import { BASKET_ROUTE, COMPARE_ROUTE, REGISTRATION_ROUTE, SELECTED_ROUTE, SHOP_ROUTE } from '../../utils/consts';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles';
import DifferenceOutlinedIcon from '@mui/icons-material/DifferenceOutlined';

export interface INavbar {
    title: string,
    loading: boolean
}

export const NavbarHeight = 65;

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        top: '3px',
        color: 'white',
        backgroundColor: theme.palette.customColor.dark,
    },
}));


const NavBar = ({ title, loading }: INavbar) => {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { search } = useLocation();
    const { isAuth } = useAppSelector(state => state.userReducer);
    const favoritesLength = useAppSelector(state => state.deviceGroupReducer.favoritesDevicesID.length)
    const basketLength = useAppSelector(state => state.deviceGroupReducer.inBasketDevicesID.length)
    const compareLength = useAppSelector(state => state.deviceGroupReducer.comparedDevicesID.length)
    const navigate = useNavigate();
    const [triggerLogout, resultLogout] = authApiUser.useLogoutMutation();
    useEffect(() => {
        if (resultLogout.isSuccess) {
            navigate("/");
        }
    }, [resultLogout.isSuccess])
    return (
        <AppBar position="static" className='NavBar' >
            <Container maxWidth="xl" className='NavBar__content' sx={{ display: 'flex'}}>
                <h1 className='NavBar__title'><NavLink to={SHOP_ROUTE + search}>{title}</NavLink></h1>
                {loading || resultLogout.isLoading ? <Loader h={40} w={40} />
                    : isAuth ?
                        <Box className='NavBarProfile' sx={{width:mobile?'auto':'300px'}}>
                            {!mobile && <Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'space-between' }}>
                                <NavLink to={BASKET_ROUTE}>
                                    <IconButton onClick={() => { }}>
                                        <StyledBadge badgeContent={basketLength || 0} color="secondary" showZero anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}>
                                            <ShoppingCartOutlinedIcon sx={{ fontSize: '37px' }} />
                                        </StyledBadge>
                                    </IconButton>
                                </NavLink>
                                <NavLink to={SELECTED_ROUTE}>
                                    <IconButton onClick={() => { }}>
                                        <StyledBadge badgeContent={favoritesLength || 0} color="secondary" showZero anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}>
                                            <FavoriteBorderOutlinedIcon sx={{ fontSize: '37px' }} />
                                        </StyledBadge>
                                    </IconButton>
                                </NavLink>
                                <NavLink to={COMPARE_ROUTE}>
                                    <IconButton onClick={() => { }}>
                                        <StyledBadge badgeContent={compareLength || 0} color="secondary" showZero anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}>
                                            <DifferenceOutlinedIcon sx={{ fontSize: '37px' }} />
                                        </StyledBadge>
                                    </IconButton>
                                </NavLink>
                            </Box>
                            }
                            <Box sx={{ ml: '20px'}}>
                                <ProfileMenu logout={triggerLogout} />
                            </Box>
                        </Box>

                        :
                        <NavLink to={REGISTRATION_ROUTE}><Button
                            variant='outlined'
                            color="customColor">Регистрация
                        </Button>
                        </NavLink>
                }


            </Container>
        </AppBar >
    );
};

export default NavBar;