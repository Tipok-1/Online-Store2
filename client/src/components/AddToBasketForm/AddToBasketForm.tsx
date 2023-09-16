import { useState, memo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import AddToBasketButton from '../AddToBasketButton/AddToBasketButton';
import { StyledTypography } from '../styledElements/styledTypography';

interface IAddToBasketForm {
    price: number,
    stock: number,
    deviceId:number
}
const AddToBasketForm = ({ price, stock, deviceId }: IAddToBasketForm) => {
    const [count, setCount] = useState(1);
    function changeCount(type: string) {
        if (type === 'increase' && count + 1 <= stock) { setCount(prev => prev + 1) }
        if (type === 'decrease' && count - 1 > 0) { setCount(prev => prev - 1) }
    }
    return (
        <Box sx={{
            borderRadius: '3px',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: '10px' }}>
                <StyledTypography variant='h5' sx={theme =>({ 
                    alignSelf: 'flex-start',
                    mr: '7px',
                    })}>{price} BYN/шт</StyledTypography>
                <Typography component="span" sx={{ color: "rgb(218, 217, 217)" }}>(в наличии {stock})</Typography>
            </Box>
            <Box sx={{
                display: 'flex',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'rgb(45,45,45)',
                    justifyContent: 'space-between',
                    width: '150px',
                }}>
                    <IconButton onClick={() => changeCount('decrease')}>
                        <RemoveIcon />
                    </IconButton>
                    <Box>{count}</Box>
                    <IconButton onClick={() => changeCount('increase')}>
                        <AddIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', ml: '15px' }}>
                    <AddToBasketButton size='medium' deviceId={deviceId}/>
                </Box>
            </Box>
        </Box >
    );
};

export default memo(AddToBasketForm);