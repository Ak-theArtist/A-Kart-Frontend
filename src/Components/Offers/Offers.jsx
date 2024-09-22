import React, { useEffect, useRef, useState } from 'react';
import './Offers.css';
import exclusive_image from '../Assets/exclusive.png';
import exclusive_image2 from '../Assets/exclusive3.png';
import exclusive_image3 from '../Assets/exclusive2.png';
import exclusive_image4 from '../Assets/exclusive4.png';
import exclusive_image5 from '../Assets/exclusive5.png';

const Offers = (props) => {
  const imgBoxRef = useRef(null);
  const exclusiveImgRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  const images = [exclusive_image, exclusive_image2, exclusive_image3, exclusive_image4, exclusive_image5]; 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='offers animate-down'>
      <div className="offers-left">
        <h1 style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }}>Exclusive</h1>
        <h1 style={{ backgroundColor: props.mode === 'light' ? 'dark' : 'light' }}>Offers For You</h1>
        <p>ONLY ON BEST SELLERS PRODUCTS</p>
        <button className='scale'>Check Now</button>
      </div>
      <div className="offers-right">
        <div className="img-box" ref={imgBoxRef}>
          <img src={images[currentImage]} ref={exclusiveImgRef} alt="Exclusive Offer" className="exclusive-img" />
        </div>
      </div>
    </div>
  );
};

export default Offers;
