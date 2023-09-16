import { memo} from 'react';
import { useAppSelector } from '../../../hooks/redux';
import Range from '../../../components/Filters/Range/Range';

const PriceRange = () => {
    const { maxPrice, minPrice } = useAppSelector(state => state.DeviceReducer);
    return (
        <Range
            minValue={minPrice}
            maxValue={maxPrice}
            title='Цена'
            value='price' />
    );
};

export default memo(PriceRange);