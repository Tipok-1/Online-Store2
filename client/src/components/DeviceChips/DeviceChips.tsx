import {useState, memo} from 'react';
import { useAppDispatch } from '../../hooks/redux';
import {deviceGroupSlice} from '../../store/reducers/DeviceGroupSlice';
import Chip from '@mui/material/Chip';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Box from '@mui/material/Box';
import { useAppSelector } from '../../hooks/redux';
import { styled } from '@mui/material/styles';


const StyledChip = styled(Chip)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
        fontSize:'12px'
    },
}))

const DeviceChips = ({deviceId}:{deviceId:number}) => {
    const {favoritesDevicesID, comparedDevicesID} = useAppSelector(state=>state.deviceGroupReducer)

    const [itFavorite, setItFavorite] = useState(favoritesDevicesID.find(el=>el === deviceId) ? true : false);
    const [itCompare, setItCompare] = useState(comparedDevicesID.find(el=>el === deviceId) ? true : false);
    const dispatch = useAppDispatch();
    function makeFavorite(){
        if(!itFavorite) {
            dispatch(deviceGroupSlice.actions.addFavoritesDeviceID(deviceId));
        } else {
            dispatch(deviceGroupSlice.actions.deleteFavoritesDeviceID(deviceId));
        }
        setItFavorite(prev => !prev);
    }

    function makeCompare(){
        if(!itCompare) {
            dispatch(deviceGroupSlice.actions.addComparedDevicesID(deviceId));
        } else {
            dispatch(deviceGroupSlice.actions.deleteComparedDevicesID(deviceId));
        }
        setItCompare(prev => !prev);
    }
    
    return (
        <Box>
            <StyledChip
                onClick={() => makeFavorite()}
                icon={<FavoriteBorderIcon />}
                sx={{ 
                    padding: '5px',
                    bgcolor:!itFavorite ? 'rgb(45,45,45)' : ''
                 }}
                label={!itFavorite ? "В ИЗБРАННОЕ" : "В ИЗБРАННОМ"} />
            <StyledChip
                onClick={() =>makeCompare()}
                icon={<CompareArrowsOutlinedIcon />}
                sx={theme=>({ 
                    padding: '5px', 
                    ml: '15px',
                    bgcolor:!itCompare ? 'rgb(45,45,45)' : '',
                    [theme.breakpoints.down("sm")]: {
                        ml:'5px'
                    },
                 })}
                label={!itCompare ? "СРАВНИТЬ" : "В СРАВНЕНИИ"} />
        </Box>
    )
}

export default memo(DeviceChips);