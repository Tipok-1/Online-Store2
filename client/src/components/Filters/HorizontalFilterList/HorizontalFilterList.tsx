import {useState, memo, useEffect} from 'react';
import { IFilterList } from '../types';
import './HorizontalFilterList.css'
import Loader from '../../Loader/Loader';
import { useAppDispatch } from '../../../hooks/redux';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';

const HorizontalFilterList = ({options, isLoading, action}:IFilterList) => {
    console.log('render')
    const [activeElement, setActiveElement] = useState(-1);
    const dispatch = useAppDispatch();

    function selectType( id:number){
        dispatch(deviceSlice.actions.setPage(1));
        if(activeElement === id) {
            if(action) {
                dispatch(action(null))
            }
            setActiveElement(-1);
            return
        }
        if(action) {
            dispatch(action(id));
        }
        setActiveElement(id);
    }

    return (
        <div className={`HorizontalFilterList`}>
            {options? options.map(el=><div 
                onClick={()=>selectType(el.id)}  
                key={el.id} 
                className={`${activeElement === el.id ? 'HorizontalFilterList__Option__active':'HorizontalFilterList__Option'}`}>{el.name}
            </div>): 
            isLoading ? 
            <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader h={20} w={20}/></div>
             : ''}
        </div>
    );
};

export default memo(HorizontalFilterList);