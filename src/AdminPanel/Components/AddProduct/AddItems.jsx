import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';
import upload_area from '../assets/upload_area.svg';
import Sidebar from '../Sidebar/Sidebar';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState([null, null, null, null]);
  const [category, setCategory] = useState('');
  const [old_price, setOld_price] = useState('');
  const [new_price, setNew_price] = useState('');
  const [message, setMessage] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!productName || !productDescription || !category || !old_price || !new_price || productImages.some(img => !img)) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('category', category);
    formData.append('old_price', old_price);
    formData.append('new_price', new_price);
    productImages.forEach((image, index) => {
      formData.append('image', image);
    });

    axios.post('https://a-kart-backend.onrender.com/product/addproduct', formData)
      .then(res => {
        setMessage('Product added successfully!');
        setProductName('');
        setProductDescription('');
        setCategory('');
        setOld_price('');
        setNew_price('');
        setProductImages([null, null, null, null]);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error adding product. Please try again.');
      });
  };

  const imageHandler = (index) => (e) => {
    const file = e.target.files[0];
    const newImages = [...productImages];
    newImages[index] = file;
    setProductImages(newImages);
  };

  return (
    <>
      <div className="main-container">
        <Sidebar />
        <div className='addproduct'>
          <div className="addproduct-itemfield">
            <p>Product Title</p>
            <input value={productName} onChange={(e) => setProductName(e.target.value)} type="text" name="name" placeholder='Type Here' />
          </div>
          <div className="addproduct-itemfield">
            <p>Product Description</p>
            <input value={productDescription} onChange={(e) => setProductDescription(e.target.value)} name="description" placeholder='Type Here' />
          </div>
          <div className="addproduct-price">
            <div className="addproduct-itemfield">
              <p>Old Price</p>
              <input value={old_price} onChange={(e) => setOld_price(e.target.value)} type="text" name="old_price" placeholder='Type Here' />
            </div>
            <div className="addproduct-itemfield">
              <p>Offer Price</p>
              <input value={new_price} onChange={(e) => setNew_price(e.target.value)} type="text" name="new_price" placeholder='Type Here' />
            </div>
          </div>
          <div className="addproduct-itemfield">
            <p>Category</p>
            <select value={category} onChange={(e) => setCategory(e.target.value)} name="category" className='add-product-selector'>
              <option value="">Select Category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kid">Kids</option>
            </select>
          </div>
          <div className="addproduct-itemfield images-upload">
            {productImages.map((image, index) => (
              <label key={index} htmlFor={`file-input${index}`}>
                <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
                <input accept='image/*' onChange={imageHandler(index)} type="file" id={`file-input${index}`} hidden />
              </label>
            ))}
          </div>
          <div className="add-button">
            <button onClick={handleSubmit} className='addproduct-btn'>ADD PRODUCT</button>
          </div>
          {message && <div className="confirmation-message">{message}</div>}
        </div>
      </div>
    </>
  );
};

export default AddProduct;
