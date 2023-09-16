import { useEffect, memo, useRef, useState } from 'react';
import TabList from '@mui/lab/TabList';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import { IDevice, IDeviceInfo } from '../../../models/IDevice';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Сharacteristic from '../../../components/Characteristic/Characteristic'
import { StyledTypography } from '../../../components/styledElements/styledTypography';
import Review from '../../../components/Review/Review';




const paymentShippingReturns = {
    payment: `
Произвести оплату можно пятью способами:
Наличный платеж – при доставке курьером или при самовывозе;
Банковской картой – физического лица;
На сайте – с помощью онлайн платежа;
Безналичный платеж – заполните свои реквизиты в корзине (или вышлите нам), и мы пришлем расчет;
Картой рассрочки - «Магнит», «Карта покупок», «Smart»
    `,
    shipping: `
Доставка по областям Беларуси (Гродно, Брест, Могилев, Гомель, Витебск) – стоимость рассчитывается индивидуально.
Доставка осуществляется в Пн-Пт. с 10.00 до 16.00. Товары заказанные на выходных, привозятся в понедельник в удобное для вас время.
    `,
    returns: `
Порядок возврата Товара ненадлежащего качества:

1) Отличие элементов дизайна или оформления от заявленных в описании на Сайте не является неисправностью или ненадлежащим качеством Товара.

2) В случае получения Покупателем Товара ненадлежащего качества Покупатель вправе вернуть Товар службе доставки и не оплачивать стоимость Товара и его доставку.

3) Покупатель, которому передан Товар не
    `
}

const StyledTab = styled(Tab)(({ theme }) => ({
    borderRight: '2px solid rgb(40,40,40)',
    "&.Mui-selected": {
        color: theme.palette.customColor.main
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: '12px'
    }
}))
const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
    bgcolor: 'primary',
    fontSize: '18px',
    [theme.breakpoints.down("md")]: {
        padding: '10px 0 0 0',
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: '16px',
    }
}))

interface IDevicePageTabs {
    device: Omit<IDevice, "brandId" | 'typeId' | 'img'> & { description: string, info: IDeviceInfo[] },
    scrollToAllHaracteristic: boolean | null,
}
const DevicePageTabs = memo(({ device, scrollToAllHaracteristic}: IDevicePageTabs) => {
    const [tabsValue, setTabsValue] = useState<string>('1');
    const allHaracteristicRef = useRef<null | Element>(null);
    const needScroll = useRef<boolean>(false);

    const changeTabs = (_: React.SyntheticEvent, newValue: string) => {
        setTabsValue(newValue);
    };
    useEffect(() => {
        if (tabsValue === '1') {
            if (scrollToAllHaracteristic !== null) {
                if (allHaracteristicRef.current) {
                    allHaracteristicRef.current.scrollIntoView({
                        behavior: 'smooth',
                        block: "center",
                    })
                }
            }
        } else {
            setTabsValue('1');
            needScroll.current = true;
        }
    }, [scrollToAllHaracteristic])

    useEffect(() => {
        if (tabsValue === '1' && needScroll.current) {
            needScroll.current = false;
            if (allHaracteristicRef.current) {
                allHaracteristicRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: "center",
                })
            }
        }
    }, [tabsValue])


    return (
        <TabContext value={tabsValue}>
            <Box sx={{ color: 'white', mt: '50px' }}>
                <TabList
                    onChange={changeTabs}
                    variant="fullWidth"
                    sx={{
                        borderRadius: '5px',
                        bgcolor: 'rgb(85,85,85)',

                    }}
                    TabIndicatorProps={{
                        sx: {
                            bgcolor: 'rgb(230, 141, 24)'
                        }
                    }}

                >
                    <StyledTab label={'ОПИСАНИЕ'} value='1' />
                    <StyledTab label={'ОПЛАТА, ДОСТАВКА И ВОЗВРАТ'} value='2' />
                    <StyledTab label={'ОТЗЫВЫ'} value='3' />
                </TabList>
                <StyledTabPanel value='1' >
                    <Typography sx={{ fontSize: 'inherit' }}>{device.description}</Typography>
                    {
                        device.info.length > 7 &&
                        <Box>
                            <StyledTypography variant='h5' sx={{ m: '20px 0' }}>Характеристики</StyledTypography>
                            <Box ref={allHaracteristicRef} sx={theme => ({
                                bgcolor: 'rgb(35,35,35)',
                                padding: '40px',
                                borderRadius: '5px',
                                width: '70%',
                                [theme.breakpoints.down("md")]: {
                                    width: 'calc(100% - 40px)',
                                    padding: '20px',
                                },
                            })}>
                                {device.info.map((inf) => <Сharacteristic key={inf.id} info={inf} fontSize={18} dottedSeparator={true} />)}
                            </Box>
                        </Box>
                    }
                </StyledTabPanel>
                <StyledTabPanel value='2' >
                    <StyledTypography variant='h5'>Способы оплаты</StyledTypography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', m: '10px', fontSize: 'inherit' }}>{paymentShippingReturns.payment}</Typography>
                    <StyledTypography variant='h5'>Доставка</StyledTypography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', m: '10px', fontSize: 'inherit' }}>{paymentShippingReturns.shipping}</Typography>
                    <StyledTypography variant='h5'>ПОРЯДОК ВОЗВРАТА ТОВАРА</StyledTypography>
                    <Typography sx={{ whiteSpace: 'pre-wrap', m: '10px', fontSize: 'inherit' }}>{paymentShippingReturns.returns}</Typography>
                </StyledTabPanel>
                <StyledTabPanel value='3' >
                    <Review deviceId={device.id} reviewsCount={device.reviewsCount}/>
                </StyledTabPanel>
            </Box >
        </TabContext >
    )
})

export default DevicePageTabs;