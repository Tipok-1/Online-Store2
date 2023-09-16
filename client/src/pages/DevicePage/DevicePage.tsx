import { useEffect, useState, useMemo, useDeferredValue } from 'react';
import './DevicePage.css'
import { useParams } from 'react-router-dom';
import { deviceApi } from '../../services/deviceService';
import Loader from '../../components/Loader/Loader';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { IDevice } from '../../models/IDevice';
import AddToBasketForm from '../../components/AddToBasketForm/AddToBasketForm';
import { makeParams } from '../../components/DeviceList/DeviceList';
import HorizontalSlider from '../../components/HorizontalSlider/HorizontalSlider';
import Rating from '@mui/material/Rating';
import DeviceChips from '../../components/DeviceChips/DeviceChips';
import { useAppSelector } from '../../hooks/redux';
import Сharacteristic from '../../components/Characteristic/Characteristic'
import DevicePageCarousel from './DevicePageComponent/DevicePageCarousel';
import DevicePageTabs from './DevicePageComponent/DevicePageTabs';
import { StyledTypography } from '../../components/styledElements/styledTypography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const DevicePage = () => {
    const { recentlyViewedID } = useAppSelector(state => state.deviceGroupReducer);
    const [scrollToAllHaracteristic, setScrollToAllHaracteristic] = useState<boolean | null>(null);
    const [loadSimilarProducts, {
        data: similarProducts,
        isLoading: similarProductsLoading,
        isSuccess: similarProductsSuccess,
        isFetching: similarProductsFetching
    }] = deviceApi.useLazyGetDevicesQuery();
    const {
        data: recentlyViewed,
        isLoading: recentlyViewedLoading,
        isSuccess: recentlyViewedSuccess,
        isFetching: recentlyViewedFetching
    } = deviceApi.useGetDevicesQuery({ IDs: JSON.stringify(recentlyViewedID) })
    let { id } = useParams();

    const { data: device, isLoading, isSuccess, isUninitialized, isFetching, isError } = deviceApi.useGetOneDeviceQuery(Number(id));
    useEffect(() => {
        setScrollToAllHaracteristic(null)
        window.scrollTo(0, 0)
    }, [id])

    useEffect(() => {
        if (isSuccess && !isError) {
            console.log('load simular')
            loadSimilarProducts(makeParams({ limit: 10, typeId: device?.typeId }))
        }
    }, [device])

    const SimilarProducts: IDevice[] = useMemo(() => {
        if (similarProductsSuccess && device?.typeId === similarProducts?.rows[0].typeId) {
            return similarProducts?.rows.filter(el => el.id !== +(id || 0)) || []
        }
        return [];
    }, [similarProducts, device])

    const RecentlyViewed: IDevice[] = useMemo(() => {
        if (recentlyViewedSuccess) {
            const arr = [];
            for (let i = 0; i < recentlyViewedID.length; i++) {
                const elem = recentlyViewed?.rows.find(el => el.id === recentlyViewedID[i]);
                if (elem)
                    arr.push(elem)
            }
            return arr;
        }
        return [];
    }, [recentlyViewed])

    function makeAnEnding(count: number): string {
        const str = count.toString()
        if (str.endsWith('12') || str.endsWith('13') || str.endsWith('12')) {
            return " Отзывов"
        }
        if (count % 10 === 1 && !str.endsWith('11')) {
            return ' Отзыв'
        } else if (str.endsWith('2') || str.endsWith('3') || str.endsWith('4')) {
            return " Отзыва";
        }
        return " Отзывов"
    }

    useEffect(() => {
        console.log(isError)
    }, [isError])
    return (
        <div className='devicePage'>
            {
                (isLoading || isUninitialized || isFetching) &&
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
            }
            {isSuccess && device ?
                <Container className='devicePage__Content' maxWidth="xl" sx={{ color: 'white' }}>
                    <Box className='devicePage__deviceInfo' sx={(theme) => ({
                        [theme.breakpoints.down("md")]: {
                            flexDirection: 'column',
                            margin: '10px 0'
                        },
                    })}>
                        <Box sx={(theme) => ({
                            width: '40%',
                            [theme.breakpoints.down("lg")]: {
                                width: '50%',
                            },
                            [theme.breakpoints.down("md")]: {
                                width: '100%',
                            },
                        })}>
                            <DevicePageCarousel slides={device!.img} />
                        </Box>

                        <Box sx={(theme) => ({
                            padding: '20px',
                            marginLeft: '8%',
                            flex: '1 1 auto',
                            [theme.breakpoints.down("lg")]: {
                                marginLeft: '4%',
                            },
                            [theme.breakpoints.down("md")]: {
                                marginLeft: '0',
                            },
                        })}>
                            <Typography variant='h4' sx={theme => ({
                                mb: '10px',
                                [theme.breakpoints.down("sm")]: {
                                    fontSize: '26px'
                                },
                            })}>{device!.name}</Typography>
                            <Box sx={{ mb: '20px', display: 'flex' }}>
                                <Rating value={device!.rating} readOnly precision={0.5} />
                                <Typography sx={{ ml: '5px', color: 'rgb(168, 167, 167)' }}>
                                    ({device!.reviewsCount}{makeAnEnding(device!.reviewsCount)})
                                </Typography>
                            </Box>
                            <DeviceChips deviceId={+id!} />
                            <hr className='devicePage__Сharacteristics_Hr'></hr>
                            <Box sx={{ mb: '20px' }}>
                                <AddToBasketForm price={device!.price} stock={device!.stock} deviceId={+id!} />
                            </Box>
                            <StyledTypography variant="h5" color={'white'} sx={{ marginBottom: '20px' }}>Характеристики</StyledTypography>
                            {
                                device!.info.map((inf, i) => i < 6 ? <Сharacteristic fontSize={16} key={inf.id} info={inf} /> : null)
                            }
                            {device!.info.length > 7 && <Typography
                                className="devicePage__Сharacteristics_over"
                                sx={{ textDecoration: 'underline dotted' }}
                                onClick={() => {
                                    setScrollToAllHaracteristic(prev => !prev)
                                }}
                            >Все характеристики</Typography>}
                        </Box>
                    </Box>

                    <DevicePageTabs scrollToAllHaracteristic={scrollToAllHaracteristic} device={device!} />
                    {
                        similarProductsLoading || similarProductsFetching ?
                            <Box sx={{ w: '100%', mt: '100px', display: 'flex', justifyContent: 'center' }}>
                                <Loader h={50} w={50} />
                            </Box>
                            :
                            SimilarProducts.length !== 0 &&
                            <Box sx={{ mt: '50px', mb: '50px' }}>
                                <HorizontalSlider title={'Вам также может понравиться'} slides={SimilarProducts} />
                            </Box>
                    }
                    {
                        recentlyViewedLoading || recentlyViewedFetching ?
                            <Box sx={{ w: '100%', mt: '100px', display: 'flex', justifyContent: 'center' }}>
                                <Loader h={50} w={50} />
                            </Box>
                            :
                            RecentlyViewed.length !== 0 &&
                            <Box sx={{ mt: '50px', mb: '50px' }}>
                                <HorizontalSlider title={'Недавно просмотренные'} slides={RecentlyViewed} />
                            </Box>
                    }
                </Container>
                : (!isLoading && !isUninitialized && !isFetching) &&
                <Box sx={{
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    fontSize:'2em'
                }}>
                    Не удалось загрузить товар
                </Box>

            }
        </div >
    );
};

export default DevicePage;