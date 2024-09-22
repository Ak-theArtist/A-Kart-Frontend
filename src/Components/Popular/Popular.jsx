import React, { useEffect, useState } from 'react'
import './Popular.css'
import Item from '../Item/Item';
import DigitalClock from '../DigitalClock/DigitalClock';
import useIntersectionObserver from '../Hooks/Hooks';
import axios from 'axios';

function Popular(props) {
    console.log(props);
    useIntersectionObserver('.hidden-popular-h1', 'show');
    const [popularProductsMen, setPopularProductsMen] = useState([]);
    const [popularProductsWomen, setPopularProductsWomen] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/auth/popularinmen`)
            .then(res => {
                setPopularProductsMen(res.data);
            })
    }, []);
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/auth/popularinwomen`)
            .then(res => {
                setPopularProductsWomen(res.data);
            })
    }, [])


    return (
        <>
            <hr />
            <DigitalClock />
            <div className='popular popular1'>
                <h1 className='hidden-popular-h1' style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }} >POPULAR IN MEN</h1>
                <hr style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }} />
                <div className="popular-item ">
                    {popularProductsMen?.map((item, i) => {
                        return <Item key={i} id={item.id} _id={item?._id} name={item.name} image={item.image} image2={item.image2} new_price={item.new_price} old_price={item.old_price} />;
                    })}
                </div>
            </div>
            <hr style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }} />
            <div className='popular popular2'>
                <h1 className='hidden-popular-h1'>POPULAR IN WOMEN</h1>
                <hr />
                <div className="popular-item ">
                    {popularProductsWomen?.map((item, i) => {
                        return <Item key={i} id={item.id} _id={item?._id} name={item.name} image={item.image} image2={item.image2} new_price={item.new_price} old_price={item.old_price} />;
                    })}
                </div>
            </div>
        </>
    )
}

export default Popular
