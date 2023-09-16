import { memo} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const StyledSwiper = styled(Swiper)(({ theme }) => ({
    width:'100%',
    position:'relative',
    '.swiper-pagination-bullet-active': {
        backgroundColor: 'rgb(230, 141, 24)'
    },
    '.swiper-pagination-bullet': {
        width: '10px',
        height: '10px'
    },
    '.swiper-button-next, .swiper-button-prev': {
        backgroundColor: "rgb(73,73,73)",
        height: '50px',
        width: '50px',
        borderRadius: '50%',
    },
    '.swiper-button-next::after, .swiper-button-prev::after': {
        color: 'white',
        fontSize: '20px',
        marginLeft: '3px',
    },
    '.swiper-button-prev::after': {
        marginLeft: '-3px',
    },
    [theme.breakpoints.down(900)]: {
        '.swiper-button-next, .swiper-button-prev': {
            border:'2px solid rgb(230, 141, 24)'
        },
    },

}))
const DevicePageCarousel = ({ slides }: { slides: string[] }) => {
    return (
        <StyledSwiper
            loop={true}
            speed={200}
            modules={[Navigation, Pagination]}
            navigation

            slidesPerView={1}
            pagination={{ clickable: true }}
            spaceBetween={30}
        >
            {slides.map(img => <SwiperSlide key={img}>
                <Box
                    sx={theme => ({
                        backgroundImage: `url(${process.env.REACT_APP_API_URL + '/' + img})`,
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        height: '530px',
                        minWidth:'450px',
                        [theme.breakpoints.up("sm")]: {
                            height: '530px',
                        },
                        [theme.breakpoints.down("sm")]: {
                            height: '430px',
                            minWidth:'350px',
                        },
                        [theme.breakpoints.down(400)]: {
                            height: '330px',
                            minWidth:'250px',
                        },

                    })}>

                </Box>

            </SwiperSlide>)}
        </StyledSwiper >
    )
}

export default memo(DevicePageCarousel);
