import './Shop.css'
import { useEffect } from 'react';
import SearchFilter from '../../components/Filters/SearchFilter/SearchFilter';
import DeviceList from '../../components/DeviceList/DeviceList';
import PickPagesList from '../../components/PickPagesList/PickPagesList';
import { deviceSlice } from '../../store/reducers/DeviceSlice';
import PriceRange from './ShopFilters/PriceRange';
import { Box } from '@mui/material';
import { useSearchParams } from "react-router-dom";
import { useAppDispatch } from '../../hooks/redux';
import TypeFilter from './ShopFilters/TypeFilter';
import BrandFilter from './ShopFilters/BrandFilter';



const Shop = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (searchParams.size) {
            searchParams.forEach((val, key) => {
                if (key === 'typeId') {
                    dispatch(deviceSlice.actions.setSelectedType(+val));
                }
                if (key === 'brandId') {
                    dispatch(deviceSlice.actions.setSelectedBrands(JSON.parse(val)))
                }
                if(key ==='search') {
                    dispatch(deviceSlice.actions.setSearch(val))
                }
            })
        } else {
            dispatch(deviceSlice.actions.reset())
        }
        
    }, [])



    return (
        <div className='Shop'>
            <div className="Shop__deviceList__wrap">
                <div className="Shop__horizontal-filters__wrap">
                    <div className="Shop__filter-types">
                        <TypeFilter />
                    </div>
                    <div className="Shop__filter-search-string">
                        <SearchFilter />
                    </div>
                </div>
                <DeviceList />
                <Box sx={{ alignSelf: 'end' }}>
                    <PickPagesList />
                </Box>
            </div>
            <div className="Shop__vertical-filters__wrap">
                <div className="Shop__filter-brands">
                    <BrandFilter />
                </div>
                <div className='Shop__filter-range__wrap'>
                    <PriceRange />
                </div>
            </div>
        </div>
    );
};
export default Shop;