import {memo} from 'react';
import './VerticalFilterList.css'
import { IFilterList } from '../types';
import Loader from '../../Loader/Loader';


const VerticalFilterList = ({options, title, isLoading}:IFilterList & {title:string}) => {
    return (
        <div className={`VerticalFilterList`}>
            <div className='VerticalFilterList__title'>{title}</div>
            {options ? options.map(el=><div key={el.id} className='VerticalFilterList__Option'>
                <label className='VerticalFilterList__Option__label'>
                    <input type='checkbox'/> 
                    <span>{el.name}</span>
                </label>
            </div>) : isLoading ? <div style={{width:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}><Loader h={20} w={20}/></div> : ''}
        </div>
    );
};

export default memo(VerticalFilterList);