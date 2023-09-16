import { memo} from 'react';
import './VerticalFilterList.css'
import { IFilterList } from '../types';
import Loader from '../../Loader/Loader';
import { useAppDispatch } from '../../../hooks/redux';
import { deviceSlice } from '../../../store/reducers/DeviceSlice';


const VerticalFilterList = ({ options, title, isLoading, action, active }: IFilterList & { title: string }) => {
    const dispatch = useAppDispatch();
    function changeBrandCheckbox(value: boolean, id: number) {
        if (action) {
            dispatch(deviceSlice.actions.categorySelected());
            if (value) {
                dispatch(action.add(id));
            } else {
                if (action.remove) {
                    dispatch(action.remove(id));
                }
            }
        }
    }

    return (
        <div className={`VerticalFilterList`}>
            <div className='VerticalFilterList__title'>{title}</div>
            {options ? options.map(el => <div key={el.id} className='VerticalFilterList__Option'>
                <label className='VerticalFilterList__Option__label'>
                    <input
                        type='checkbox'
                        onChange={e => changeBrandCheckbox(e.currentTarget.checked, el.id)}
                        checked={(Array.isArray(active) && active.find(e=>e === el.id)) ? true : false}/>
                    <span>{el.name}</span>
                </label>
            </div>) : isLoading ? <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Loader h={20} w={20} /></div> : ''}
        </div>
    );
};

export default memo(VerticalFilterList);