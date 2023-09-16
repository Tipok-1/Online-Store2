import { useEffect, memo, useMemo } from 'react';
import VerticalFilterList from '../../../components/Filters/VerticalFilterList/VerticalFilterList'
import { brandApi } from '../../../services/brandService';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';
import { useAppSelector } from '../../../hooks/redux';

const BrandFilter = () => {
    const [brandTrigger, { data: brandData, isLoading: isLoadingBrand }] = brandApi.useLazyGetBrandsQuery();
    const { brandId } = useAppSelector(state => state.DeviceReducer)
    useEffect(() => {
        brandTrigger('');
    }, [])


    const BrandFilterAction = useMemo(() => {
        return {
            add: deviceSlice.actions.addSelectedBrand,
            remove: deviceSlice.actions.removeSelectedBrand
        }
    }, [deviceSlice.actions.addSelectedBrand, deviceSlice.actions.removeSelectedBrand])

    const active = useMemo(() => {
        return brandId
    }, [brandId])

    return (
        <VerticalFilterList action={BrandFilterAction}
            options={brandData}
            title={'Производители'}
            isLoading={isLoadingBrand}
            active={active}
        />
    );
};

export default memo(BrandFilter);