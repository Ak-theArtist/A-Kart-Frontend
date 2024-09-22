import React, { useContext, useState } from 'react';
import './CSS/ShopCategory.css';
import { ShopContext } from '../Context/ShopContext';
import Item from '../Components/Item/Item';
import useIntersectionObserver from '../Components/Hooks/Hooks';

const ShopCategory = (props) => {
  const { allProduct } = useContext(ShopContext);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState('priceAsc'); 

  useIntersectionObserver('.animate-scale-up', 'show');

  const loadMoreProducts = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProducts(prev => prev + 12);
      setIsLoading(false);
    }, 1000);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const filteredProducts = allProduct.filter(item => item.category === props.category);

  // Sort products based on the selected sort order
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case 'latest':
        return new Date(b.date) - new Date(a.date); 
      case 'priceAsc':
        return a.new_price - b.new_price;
      case 'priceDesc':
        return b.new_price - a.new_price;
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const displayedCount = Math.min(visibleProducts, sortedProducts.length);

  return (
    <>
      <div className='shop-category'>
        <img className='shopcategory-banner animate-scale-up' src={props.banner} alt="" />
        <div className="shopcategory-indexSort">
          <p>
            <span>Showing {sortedProducts.length === 0 ? '0-0' : `1-${displayedCount}`}</span> out of {sortedProducts.length} products
          </p>
          <div className="shopcategory-sort">
            Sort by- 
            <select onChange={handleSortChange} value={sortOrder}>
              <option value="latest">Latest products</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="nameDesc">Name: Z to A</option>
            </select>
          </div>
        </div>
        <div className="shopcategory-products">
          {sortedProducts.slice(0, visibleProducts).map((item, i) => (
            <Item key={i} id={item.id} _id={item?._id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
          ))}
        </div>
      </div>
      <div className="shopcategory-loadmore">
        <button className="button-explore" onClick={loadMoreProducts} disabled={isLoading || sortedProducts.length === 0}>
          {isLoading ? 'Loading...' : 'Show more...'}
        </button>
      </div>
    </>
  );
};

export default ShopCategory;
