import Slider from '@mui/material/Slider';
import './Range.css'
import { useState, useEffect, memo} from 'react'
import { useDebounce } from '../../../hooks/debounce';
import { useAppDispatch } from '../../../hooks/redux';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';

interface IRange {
    title: string,
    minValue: number,
    maxValue: number,
    value: string,
    selectedMax?: number,
    selectedMin?: number
}
const Range = ({ title, maxValue, minValue, value }: IRange) => {
    const [selectedMinValue, setSelectedMinValue] = useState(minValue);
    const [selectedMaxValue, setSelectedMaxValue] = useState(maxValue);
    const dispatch = useAppDispatch();

    const debounceCallback = useDebounce((arr: number[]) => {
        if (value == 'price') {
            dispatch(deviceSlice.actions.setSelectedMaxPrice(arr[1]));
            dispatch(deviceSlice.actions.setSelectedMinPrice(arr[0]));
        }
    }, 500)
    function changeRange(_: Event, arr: number[] | number) {
        if (Array.isArray(arr)) {
            setSelectedMinValue(arr[0]);
            setSelectedMaxValue(arr[1]);
            debounceCallback(arr);
        }
    }

    useEffect(() => {
        if (maxValue !== null) {
            setSelectedMaxValue(maxValue);
        } else {
            setSelectedMaxValue(0);
        }
        if (minValue !== null) {
            setSelectedMinValue(minValue);
        } else { setSelectedMinValue(0); }
    }, [minValue, maxValue])

    return (
        <div className='Range__wrap'>
            <div className='Range__title'>{title}</div>
            <div>
                <Slider
                    min={minValue}
                    max={maxValue}
                    color='customColor'
                    step={1}
                    value={[selectedMinValue, selectedMaxValue]}
                    onChange={changeRange}
                />
            </div>
            <div className='Range__values' >
                <div className='Range__value'>{selectedMinValue}</div>
                <div className='Range__value'>{selectedMaxValue}</div>
            </div>

        </div>
    );
};

export default memo(Range);