import { useState, useEffect } from 'react';
import './OneDevice.css'
import { IDevice } from '../../models/IDevice';
import Loader from '../Loader/Loader';
import Rating from '@mui/material/Rating';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import { DEVICE_ROUTE } from '../../utils/consts';
import AddToBasketButton from '../AddToBasketButton/AddToBasketButton';
import { useAppDispatch } from '../../hooks/redux';
import { deviceGroupSlice } from '../../store/reducers/DeviceGroupSlice';

interface IOneDevice {
    device: IDevice,
    height?: number,
    fontSize?: number,
    buttonSize?: 'small' | 'medium' | 'large',
    button?: boolean,
    cardContentPadding?: number,
    whereCutText?: number
}

const OneDevice = ({ device, height, fontSize, button = true, buttonSize = 'medium', cardContentPadding, whereCutText = 48 }: IOneDevice) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loadingImage, setLoadingImage] = useState(false);
    const [error, setError] = useState('');
    function load(src: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            setLoadingImage(true);
            const image = new Image();
            image.onload = () => { resolve(image); setLoadingImage(false) }
            image.onerror = () => { reject('Не удалось загрузить изображение'); setLoadingImage(false); }
            image.src = src;

        });
    }
    useEffect(() => {
        load(process.env.REACT_APP_API_URL + '/' + device.img[0]).catch((err) => setError(err))
    }, [])

    function clickDevice() {
        dispatch(deviceGroupSlice.actions.addRecentlyViewedID(device.id));
        navigate(DEVICE_ROUTE + '/' + device.id);
    }
    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
                onClick={() => clickDevice()}
                className='oneDevice__Card'
                sx={{ height: height ? `${height}px` : '470px' }}>
                {
                    loadingImage ?
                        <div className='oneDevice__image'>< Loader h={20} w={20} /></div >
                        :
                        <CardMedia
                            sx={{ objectFit: 'cover' }}
                            className='oneDevice__image'
                            component="img"
                            draggable={false}
                            image={`${process.env.REACT_APP_API_URL + '/' + device.img[0]}`}
                            alt={error}
                        />
                }
                <CardContent
                    className='oneDevice__cardContent'
                    sx={{ padding: cardContentPadding ? `${cardContentPadding}px` : '' }}
                >
                    <Typography sx={{ fontSize: fontSize ? `${fontSize}px` : '20px', lineHeight: 'normal' }} noWrap>{device.name}</Typography>
                    <Box>
                        <Typography sx={{ fontSize: fontSize ? `${fontSize}px` : '18px' }}>Цена: {device.price}</Typography>
                        <Rating name="read-only" value={device.rating} readOnly precision={0.5}/>
                    </Box>
                </CardContent>
                {button &&
                    <CardActions className='oneDevice__cardActions' sx={{w:'auto'}}>
                        <AddToBasketButton size={buttonSize || 'medium'} deviceId={device.id}/>
                    </CardActions>
                }
            </Card >
        </Grid>
    );
};
export default OneDevice;
