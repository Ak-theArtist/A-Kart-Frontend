import React from 'react'
import './Item.css'
import { Link } from 'react-router-dom'
import useIntersectionObserver from '../Hooks/Hooks'

const Item = (props) => {
  useIntersectionObserver('.animate-down', 'show');
  const discountPercentage = Math.round(((props.old_price - props.new_price) / props.old_price) * 100);
  return (
    <div className='item animate-down'>
      <div className="inner-container">
        <Link to={`/product/${props._id}`}><img onClick={window.scrollTo(0, 0)} className='image[0]' id='image' src={props?.image[0]} /></Link>
        <Link to={`/product/${props._id}`}><img onClick={window.scrollTo(0, 0)} className='image[1]' id='image2' src={props?.image[1]} /></Link>
        <Link to={`/product/${props._id}`}><img onClick={window.scrollTo(0, 0)} className='image[2]' id='image3' src={props?.image[2]} /></Link>
        <Link to={`/product/${props._id}`}><img onClick={window.scrollTo(0, 0)} className='image[3]' id='image4' src={props?.image[3]} /></Link>
      </div>
      <p className='product-name'>{props.name}</p>
      <div className="item-discount"><b>Discount {discountPercentage}%</b></div>
      <div className='item-prices'>
        <div className="item-price-old">
          &#8377;{props.old_price}
        </div>
        <div className="item-price-new">
          <b>&#8377;{props.new_price}</b>
        </div>
      </div>
    </div>
  )
}

export default Item
