import { memo } from 'react';
import { IDevice } from '../../models/IDevice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import './HorizontalSlider.css'
import OneDevice from '../OneDevice/OneDevice';
import { styled } from '@mui/material/styles';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


interface IHorizontalSlider {
    slides: IDevice[],
    title: string
}
const HorizontalStyledSwiper = styled(Swiper)(({ theme }) => ({
    padding: '0 25px',
    [theme.breakpoints.down('md')]: {
        padding: '0 15px',
    },
    [theme.breakpoints.down('sm')]: {
        padding: '0',
    },

    '.swiper-pagination-bullet-active': {
        backgroundColor: 'rgb(230, 141, 24)'
    },
    '.swiper-pagination-bullet': {
        width: '10px',
        height: '10px'
    },
    '.swiper-pagination': {
        position: 'relative',
        marginTop: '20px',
        [theme.breakpoints.up('sm')]: {
            display: 'none'
        },
        [theme.breakpoints.down('sm')]: {
            display: 'block'
        },
    },
    '.swiper-button-next, .swiper-button-prev': {
        backgroundColor: 'rgb(230, 141, 24)',
        height: '50px',
        width: '50px',
        [theme.breakpoints.down('md')]: {
            height: '40px',
            width: '40px',
        },
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
        borderRadius: '50%'
    },
    '.swiper-button-next': {
        right: '0'
    },
    '.swiper-button-prev': {
        left: '0'
    },
    '.swiper-button-next::after, .swiper-button-prev::after': {
        fontSize: '16px',
        color: 'white',
        marginLeft: '3px',
        lineHeight: '2'
    },
    '.swiper-button-prev::after': {
        marginLeft: '-3px',
    },
    '.swiper-button-prev.swiper-button-disabled, .swiper-button-next.swiper-button-disabled':{
        pointerEvents: 'auto'
    }
}))

const HorizontalSlider = ({ slides, title }: IHorizontalSlider) => {
    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant='h6' component='span' sx={{
                bgcolor: 'rgb(230, 141, 24)',
                //color:'rgb(230, 141, 24)',
                padding: '10px',
                fontSize: '18px',
                borderRadius: '3px'
            }}>{title}</Typography>
            <Box sx={{
                position: 'relative',
                borderTop: '2px solid rgb(230, 141, 24)',
                mt: '4px',
                padding: '20px 15px 15px 15px',
            }}>
                <HorizontalStyledSwiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true }}
                    spaceBetween={30}
                    breakpoints={{
                        1040: {
                            slidesPerView: 4,
                            spaceBetween: 30
                        },
                        700: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        },
                        500: {
                            slidesPerView: 2,
                            spaceBetween: 10
                        },
                        100: {
                            slidesPerView: 1,
                            spaceBetween: 10
                        }
                    }}
                /*onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}*/
                >
                    {
                        slides.map(el =>
                            <SwiperSlide key={el.id} /*className="HorizontalSlider__SliderItem" style={{ width: '350px' }}*/>
                                <OneDevice device={el} height={350} fontSize={16} whereCutText={30} buttonSize='small' cardContentPadding={10} />
                            </SwiperSlide>

                        )
                    }

                </HorizontalStyledSwiper>
            </Box>
        </Box >

    );
};

export default memo(HorizontalSlider);
