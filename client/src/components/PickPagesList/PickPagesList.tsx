import { memo,ChangeEvent} from 'react'
import './PickPagesList.css'
import { useAppSelector } from '../../hooks/redux';
import { pageCountSelector } from '../../store/reducers/DeviceSlice';
import { useAppDispatch } from '../../hooks/redux';
import { deviceSlice } from '../../store/reducers/DeviceSlice';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles';
import { StyledPagination } from '../styledElements/styledPagination';


const PickPagesList = () => {
    const pageCount = useAppSelector(pageCountSelector)
    const activePage = useAppSelector(state=>state.DeviceReducer.page)
    const dispatch = useAppDispatch();

    const theme = useTheme();
    const desktop = useMediaQuery(theme.breakpoints.up("md"));

    function changePage(_: ChangeEvent<unknown>, pageNum: number) {
        dispatch(deviceSlice.actions.setPage(pageNum));
        window.scrollTo(0, 0)
    }
    return (
        <Box className="Pagination__Box" >
            {pageCount ?
            <StyledPagination
                count={pageCount}
                variant="outlined"
                page={activePage}
                onChange={changePage}
                shape="rounded"
                
                size={desktop ? 'large' :'medium'} />
            : 
            <Typography variant='h4' sx={{color:'white'}}>Ничего не найдено</Typography>
        }
        </Box>
    );
};
export default memo(PickPagesList);