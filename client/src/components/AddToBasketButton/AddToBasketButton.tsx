import { memo, useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import { useAppSelector, useAppDispatch} from '../../hooks/redux';
import { deviceGroupSlice } from '../../store/reducers/DeviceGroupSlice';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles';


interface IAddToBasketButton {
    size?: "small" | "medium" | "large",
    deviceId:number
}
const AddToBasketButton = ({ size, deviceId}: IAddToBasketButton) => {
    const theme = useTheme();
    const tablet = useMediaQuery(theme.breakpoints.down("sm"));
    const deviceInBasket = useAppSelector(state=>state.deviceGroupReducer.inBasketDevicesID.find(el=>el === deviceId))
    const dispatch = useAppDispatch();
    const [inBasket, setInBasket] = useState(deviceInBasket ? true : false);
    
    function clickButton(e: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        e.stopPropagation();
        if(inBasket) {
            dispatch(deviceGroupSlice.actions.deleteInBasketDevicesID(deviceId));
        } else {
            dispatch(deviceGroupSlice.actions.addInBasketDevicesID(deviceId))
        }
        setInBasket(prev=>!prev)
    }
    return (
        <>
        <Button
            color='customColor'
            variant='outlined'
            size={!tablet ? size : 'small'}
            onClick={e=>clickButton(e)}
            
        >{!inBasket ? <span>Добавить в корзину</span> : <span>Убрать из корзины</span>}</Button>
        
        </>
    );
};

export default memo(AddToBasketButton);