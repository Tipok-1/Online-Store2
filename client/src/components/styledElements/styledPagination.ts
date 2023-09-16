import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';

export const StyledPagination = styled(Pagination)(( ) => ({
    '& .MuiPaginationItem-root.Mui-selected':{
        border:'1px solid rgb(230, 141, 24)'
    },
    '& .MuiPaginationItem-previousNext:hover':{
        color:'rgb(230, 141, 24)'
    }
}))