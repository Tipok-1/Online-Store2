import React from 'react';
import './Loader.css'

interface ILoader{
    h?:number,
    w?:number
}

const Loader = ({h= 100,w=100}:ILoader) => {
    return (
        <div className='Loader' style={{height:h+'px', width:w +'px'}}>
            
        </div>
    );
};

export default Loader;