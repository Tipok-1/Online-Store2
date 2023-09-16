import {useMemo, useEffect, memo} from 'react';
import HorizontalFilterList from '../../../components/Filters/HorizontalFilterList/HorizontalFilterList';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';
import { typeApi } from '../../../services/typeService';
import { useAppSelector } from '../../../hooks/redux';


const TypeFilter = () => {
    const active = useAppSelector(state=>state.DeviceReducer.typeId);
    const [typeTrigger, { data: typeData, isLoading: isLoadingType }] = typeApi.useLazyGetTypesQuery();
    useEffect(()=>{
        typeTrigger('');
    },[])
    const TypeFilterAction = useMemo(() => {
        return { add: deviceSlice.actions.setSelectedType }
    }, [deviceSlice.actions.setSelectedType])

    return (
        <HorizontalFilterList action={TypeFilterAction} options={typeData} isLoading={isLoadingType} active={active}/>
    );
};

export default memo(TypeFilter);