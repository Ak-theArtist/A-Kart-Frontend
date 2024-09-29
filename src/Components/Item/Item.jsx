import React from 'react';
import './Item.css';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../Hooks/Hooks';

// Skeleton card for loading state
const SkeletonItem = () => {
  return (
    <div className='item skeleton'>
      <div className="inner-container">
        <div className="skeleton-image"></div>
      </div>
      <div className='skeleton-text skeleton-product-name'></div>
      <div className="skeleton-text skeleton-discount"></div>
      <div className='item-prices'>
        <div className="skeleton-text skeleton-price-old"></div>
        <div className="skeleton-text skeleton-price-new"></div>
      </div>
    </div>
  );
};

const Item = (props) => {
  useIntersectionObserver('.animate-down', 'show');

  // Show skeleton if data is not loaded
  if (!props.name || !props.image || !props.new_price || !props.old_price) {
    return <SkeletonItem />;
  }

  const discountPercentage = Math.round(((props.old_price - props.new_price) / props.old_price) * 100);

  return (
    <div className='item animate-down'>
      <div className="inner-container">
        <Link to={`/product/${props._id}`}>
          <img onClick={() => window.scrollTo(0, 0)} className='image[0]' id='image1' src={props?.image[0]} alt="Product" />
        </Link>
        <Link to={`/product/${props._id}`}>
          <img onClick={() => window.scrollTo(0, 0)} className='image[1]' id='image2' src={props?.image[1]} alt="Product" />
        </Link>
        <Link to={`/product/${props._id}`}>
          <img onClick={() => window.scrollTo(0, 0)} className='image[2]' id='image3' src={props?.image[2]} alt="Product" />
        </Link>
        <Link to={`/product/${props._id}`}>
          <img onClick={() => window.scrollTo(0, 0)} className='image[3]' id='image4' src={props?.image[3]} alt="Product" />
        </Link>
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
  );
};

export default Item;
