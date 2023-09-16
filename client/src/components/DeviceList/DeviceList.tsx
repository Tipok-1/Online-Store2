import { useEffect, memo, useState, useRef} from 'react';
import { deviceApi } from '../../services/deviceService';
import './DeviceList.css'
import OneDevice from '../OneDevice/OneDevice';
import Loader from '../Loader/Loader';
import { useAppSelector } from '../../hooks/redux';
import { useAppDispatch } from '../../hooks/redux';
import { deviceSlice } from '../../store/reducers/DeviceSlice';
import { deviceParams } from '../../services/deviceService';
import Grid from '@mui/material/Grid';
import { IDeviceInitialState } from '../../store/reducers/DeviceSlice';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSearchParams } from "react-router-dom";

export type IMakeParams = Pick<deviceParams, 'limit' | 'page' | 'typeId' | 'search'> &
    Pick<IDeviceInitialState, 'brandId' | 'selectedMaxPrice' | 'selectedMinPrice'>

export function makeParams({ limit, page, typeId, brandId, selectedMinPrice, selectedMaxPrice, search }: IMakeParams): deviceParams {
    const params: deviceParams = {};
    if (limit) params.limit = limit
    if (page) params.page = page
    if (typeId) params.typeId = typeId
    if (brandId) {
        if (brandId.length) {
            params.brandId = JSON.stringify(brandId);
        }
    }
    if (selectedMinPrice) params.minPrice = selectedMinPrice
    if (selectedMaxPrice) params.maxPrice = selectedMaxPrice
    if (search) params.search = search;
    return params;
}

const DeviceList = () => {
    const firstLoading = useRef(true)
    let [searchParams, setSearchParams] = useSearchParams();
    const [deviceTrigger, { isSuccess, isLoading, isFetching, data: devices = { rows: [], count: 0, maxPrice: 0, minPrice: 0 } }] = deviceApi.useLazyGetDevicesQuery();
    const { limit, page, typeId, brandId, selectedMaxPrice, selectedMinPrice, maxPrice, minPrice, search } = useAppSelector(state => state.DeviceReducer)
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        let params = makeParams({ limit, page, typeId, brandId, selectedMaxPrice, selectedMinPrice, search });
        if(firstLoading.current) {
            firstLoading.current = false;
        } else{
            const searchParams:deviceParams = {...params}
            if(params.minPrice) {
                delete searchParams.minPrice;
            }
            if(params.maxPrice) {
                delete searchParams.maxPrice;
            }
            setSearchParams(searchParams as URLSearchParams);
        }
        deviceTrigger(params);
    }, [typeId, brandId, limit, page, selectedMaxPrice, selectedMinPrice, search])

    useEffect(() => {
        if (isSuccess) {
            dispatch(deviceSlice.actions.setCount(devices.count));
            if (!minPrice && !maxPrice) {
                dispatch(deviceSlice.actions.setMaxPrice(devices.maxPrice));
                dispatch(deviceSlice.actions.setMinPrice(devices.minPrice));
            }
        }
    }, [devices])

 return (
        <>
            {isLoading ? <div style={{
                display: 'flex',
                padding: '100px',
                flex: '1 1 auto',
                justifyContent: 'center',
                alignItems: 'center'
            }}><Loader /> </div> :
                <>
                    {isFetching && <Box sx={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', mt: '20px' }}>
                        <Loader w={15} h={15} />
                        <Typography sx={{ mt: '3px' }}>Loading...</Typography>
                    </Box>}
                        
                        <Grid container spacing={2} sx={{ mt: !isFetching ? '30px' : '10px' }}>
                            {
                                devices.rows.map(el => <OneDevice key={el.id} device={el} />)
                            }
                        </Grid>
                    
                </>
            }
        </>
    );
};

export default memo(DeviceList);