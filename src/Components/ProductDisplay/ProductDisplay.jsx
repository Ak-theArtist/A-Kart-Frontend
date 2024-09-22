import React, { useContext, useEffect, useState } from 'react';
import './ProductDisplay.css';
import { ShopContext } from '../../Context/ShopContext';
import axios from 'axios';
import { Modal, Alert } from 'antd';
import EditProduct from '../../AdminPanel/Components/EditProduct/EditProduct';

const ProductDisplay = ({ product }) => {
  const [newCollection, setNewCollection] = useState([]);
  const { addToCart, userRole } = useContext(ShopContext);
  const [alert, setAlert] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(product.image[0]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState('4');
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/auth/newcollections`)
      .then((response) => {
        setNewCollection(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  useEffect(() => {
    if (product) {
      window.scrollTo(0, 0);
      setSelectedImage(product.image[0]);
    }
  }, [product]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleAddToCart = (productId) => {
    addToCart(productId);
    setAlert({
      message: 'Item added successfully!',
      type: 'success'
    });
  };

  const handleEditClick = (event) => {
    event.stopPropagation();
    setEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
  };

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const handleMainImageClick = () => {
    if (window.innerWidth > 775) {
      setIsLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleRatingChange = (event) => {
    setSelectedRating(event.target.value);
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const discountPercentage = Math.round(((product.old_price - product.new_price) / product.old_price) * 100);

  return (
    <>
      <Modal
        title="Edit Product"
        open={editModalVisible}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <EditProduct productId={product._id} onClose={handleEditModalClose} />
      </Modal>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          showIcon
          style={{ position: 'fixed', right: 10, zIndex: 1000 }}
        />
      )}

      <div className='productdisplay'>
        <div className="productdisplay-left">
          <div className="productdisplay-img-list">
            {product.image.map((img, index) => (
              <img
                key={index}
                loading='lazy'
                src={img}
                alt={`Product ${index}`}
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
          <div className="productdisplay-img productdisplay-main-img-container" onClick={handleMainImageClick}>
            <img className='productdisplay-main-img' src={selectedImage} alt={product.name} />
            {userRole === 'admin' && (
              <button className="edit-button" onClick={handleEditClick}>
                <svg className="edit-svgIcon" viewBox="0 0 512 512">
                  <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="productdisplay-right">
          <h1>{product.name}</h1>
          <div className="rating-icon">
            <div className="rating">
              {[5, 4, 3, 2, 1].map(value => (
                <React.Fragment key={value}>
                  <input
                    type="radio"
                    id={`star${value}`}
                    name="rate"
                    value={value}
                    checked={selectedRating === value.toString()}
                    onChange={handleRatingChange}
                  />
                  <label htmlFor={`star${value}`} title={`${value} star`} />
                </React.Fragment>
              ))}
            </div>
            <p>(1.5k)</p>
          </div>
          <div>
            <div className="productdisplay-right-discount">Discount {discountPercentage}%</div>
            <div className="productdisplay-right-prices">
              <div className="productdisplay-right-price-old">&#8377;{product.old_price}</div>
              <div className="productdisplay-right-price-new">&#8377;{product.new_price}</div>
            </div>
          </div>

          <div className="productdisplay-right-size">
            <div className='mt-2'>
              <b>Category: </b>{capitalize(product.category)}
            </div>
          </div>
          <div className="productdisplay-right-description">
            <b>Description: </b>{product.description}
          </div>
          <button className="CartBtn" onClick={() => handleAddToCart(product._id)}>
            <span className="IconContainer">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="rgb(17, 17, 17)" className="cart">
                <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
              </svg>
            </span>
            <span className="CartText">Add to Cart</span>
          </button>
        </div>
      </div>
      <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
          <div
            className="descriptionbox-nav-box mb-4"
            onClick={toggleDescription}
          >
            {isExpanded ? 'Show Less' : 'Show Full Description'}
          </div>
        </div>
        <div className={`descriptionbox-description ${isExpanded ? 'expanded' : ''}`}>
          <p>
            {product.description}
          </p>
        </div>
      </div>
      {isLightboxOpen && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content">
            <img src={selectedImage} alt="lightbox" />
            <span className="close" onClick={closeLightbox}>&times;</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDisplay;
