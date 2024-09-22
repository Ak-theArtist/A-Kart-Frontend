import React, { useEffect, useState } from 'react';
import './RelatedProducts.css';
import Item from '../Item/Item';
import axios from 'axios';

const RelatedProducts = (props) => {
  const [all_collection, setAll_collection] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get(`https://a-kart-backend.onrender.com/product/allproducts`)
      .then((response) => {
        const shuffledProducts = shuffleArray(response.data);
        setAll_collection(shuffledProducts);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const shuffleArray = (array) => {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  const loadMoreProducts = (e) => {
    e.preventDefault(); 
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => prev + 5);
      setIsLoading(false);
    }, 1000); 
  };
  

  return (
    <>
      <div className='relatedproducts'>
        <h1>Related Products</h1>
        <hr />
        <div className="relatedproducts-item">
          {all_collection.slice(0, visibleProducts).map((item, i) => (
            <Item key={i} id={item.id} _id={item?._id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
          ))}
        </div>
      </div>
      <div className="shopcategory-loadmore">
        <button className="button-explore" onClick={loadMoreProducts} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Show more...'}
        </button>
      </div>
    </>
  );
};

export default RelatedProducts;
