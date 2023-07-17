import React from 'react';
import './SearchFilter.css'
import Input from '../../UI/Input/Input';

const SearchFilter = () => {
    return (
        <div className='SearchFilter'>
            <Input className='SearchFilter__Input' type='search' placeholder='Поиск товара...'/>
        </div>
    );
};

export default SearchFilter;