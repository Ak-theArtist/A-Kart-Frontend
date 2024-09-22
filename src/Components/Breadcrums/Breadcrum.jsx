import React from 'react';
import './Breadcrum.css';
import arrow_icon from '../Assets/breadcrum_arrow.png';

const Breadcrum = (props) => {
    const { product } = props;
    const capitalizeCategory = (category) => {
        if (!category) return '';
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    return (
        <div className='breadcrum'>
            HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {capitalizeCategory(product.category)} <img src={arrow_icon} alt="" /> {product.name}
        </div>
    );
}

export default Breadcrum;
