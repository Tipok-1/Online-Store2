import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

export const StyledTypography = styled(Typography)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        fontSize:'20px',
    }
}))