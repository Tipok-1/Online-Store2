import {useState, memo, useEffect} from 'react';
import { IFilterList } from '../types';
import './HorizontalFilterList.css'
import Loader from '../../Loader/Loader';
import { useAppDispatch} from '../../../hooks/redux';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';
import { Box } from '@mui/material';

const HorizontalFilterList = ({options, isLoading, action, active}:IFilterList) => {
    const [activeElement, setActiveElement] = useState(active || -1);
    const dispatch = useAppDispatch();

    function selectType( id:number){
        dispatch(deviceSlice.actions.categorySelected());
        if(activeElement === id) {
            if(action) {
                dispatch(action.add(null))
            }
            setActiveElement(-1);
            return
        }
        if(action) {
            dispatch(action.add(id));
        }
        setActiveElement(id);
    }

    useEffect(()=>{
        if(active && options && !Array.isArray(active)){
            setActiveElement(active)
        } else {
            setActiveElement(-1)
        }
    },[options])

    return (
        <Box className={`HorizontalFilterList`}>
            {options? options.map(el=><Box  
                onClick={()=>selectType(el.id)}  
                key={el.id} 
                className={`${activeElement === el.id ? 'HorizontalFilterList__Option__active':'HorizontalFilterList__Option'}`}>{el.name}
            </Box >): 
            isLoading ? 
            <Box  style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader h={20} w={20}/></Box >
             : ''}
        </Box>
    );
};

export default memo(HorizontalFilterList);