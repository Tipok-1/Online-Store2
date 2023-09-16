import { useState, useEffect, memo } from 'react';
import { NavLink } from "react-router-dom";
import TreangleImage from '../../assets/treangle.png'
import './ProfileMenu.css'
import { useAppSelector } from '../../hooks/redux';
import Box from '@mui/material/Box';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import IconButton from '@mui/material/IconButton'
import { BASKET_ROUTE, COMPARE_ROUTE, SELECTED_ROUTE } from '../../utils/consts';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { ListItem } from '@mui/material';


const ProfileMenu = ({ logout }: { logout: Function }) => {
    const { user, sentEmailConfirmation } = useAppSelector(state => state.userReducer);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [hiddenOptions, setHiddenOptions] = useState(false)
    function clickProfile(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        console.log('click')
        setAnchorEl(e.currentTarget);
        setHiddenOptions(!hiddenOptions)
    }
    function handleClick() {
        setHiddenOptions(!hiddenOptions)
    }
    return (

        <div className='Navbar__profile-wrap'>
            <Box sx={{ display: 'flex' }} onClick={e => clickProfile(e)}>
                <IconButton onClick={() => { }} sx={{ position: 'relative' }}>
                    <PermIdentityOutlinedIcon sx={{ fontSize: '42px' }} />
                    <Box className="Navbar__profile-arrow" sx={{
                        transform: hiddenOptions ? 'rotate(180deg)' : 'rotate(0)',
                        backgroundImage: `url(${TreangleImage})`,
                        position: 'absolute',
                        left: '70%'
                    }}>

                    </Box>
                </IconButton>

            </Box>
            <Menu
                anchorEl={anchorEl}
                open={hiddenOptions}
                transitionDuration={200}
                onClose={handleClick}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "white"
                    }
                }}
            >
                <ListItem>
                    <div className='ProfileMenu__options__title'>
                        {user.email}
                        {!user.isActivated && <div className='ProfileMenu__message'>Email не подтверждён</div>}
                        {user.isActivated && <div className='ProfileMenu__message' style={{ color: 'green' }}>Email подтверждён</div>}
                    </div>
                </ListItem>
                <MenuItem onClick={handleClick}>
                    <NavLink to={BASKET_ROUTE} >
                        <Box className='ProfileMenu__oneOption'>Корзина</Box>
                    </NavLink>
                </MenuItem>
                <MenuItem onClick={handleClick}>
                    <NavLink to={SELECTED_ROUTE}>
                        <Box className='ProfileMenu__oneOption'>Избранное</Box>
                    </NavLink>
                </MenuItem >
                <MenuItem onClick={handleClick}>
                    <NavLink to={COMPARE_ROUTE}>
                        <Box className='ProfileMenu__oneOption'>Сравнение</Box>
                    </NavLink>
                </MenuItem>
                {!user.isActivated &&
                    <Box
                        className={!sentEmailConfirmation ? 'ProfileMenu__oneOption' : 'ProfileMenu__oneOption_disabled'}
                        sx={{ color: sentEmailConfirmation ? 'grey' : '' }}>Подтвердить email</Box>
                }
                <MenuItem onClick={handleClick}>
                    <Box className='ProfileMenu__oneOption' onClick={() => logout()}>Выйти</Box>
                </MenuItem>
            </Menu>
        </div>
    );
};

export default memo(ProfileMenu);