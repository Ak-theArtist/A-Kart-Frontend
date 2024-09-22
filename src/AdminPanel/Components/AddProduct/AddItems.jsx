import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';
import upload_area from '../assets/upload_area.svg';
import Sidebar from '../Sidebar/Sidebar';

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage1, setProductImage1] = useState(null);
  const [productImage2, setProductImage2] = useState(null);
  const [productImage3, setProductImage3] = useState(null);
  const [productImage4, setProductImage4] = useState(null);
  const [category, setCategory] = useState('');
  const [old_price, setOld_price] = useState('');
  const [new_price, setNew_price] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('description', productDescription);
    formData.append('category', category);
    formData.append('old_price', old_price);
    formData.append('new_price', new_price);
    formData.append('image', productImage1);
    formData.append('image', productImage2);
    formData.append('image', productImage3);
    formData.append('image', productImage4);

    axios.post('https://a-kart-backend.onrender.com/product/addproduct', formData)
      .then(res => {
        console.log(res);
        window.location.reload();
      })
      .catch(err => console.log(err));
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    setProductImage1(file);
  };
  const image2Handler = (e) => {
    const file = e.target.files[0];
    setProductImage2(file);
  };
  const image3Handler = (e) => {
    const file = e.target.files[0];
    setProductImage3(file);
  };
  const image4Handler = (e) => {
    const file = e.target.files[0];
    setProductImage4(file);
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
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kid">Kids</option>
            </select>
          </div>
          <div className="addproduct-itemfield images-upload">
            <label htmlFor="file-input">
              <img src={productImage1 ? URL.createObjectURL(productImage1) : upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <label htmlFor="file-input2">
              <img src={productImage2 ? URL.createObjectURL(productImage2) : upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <label htmlFor="file-input3">
              <img src={productImage3 ? URL.createObjectURL(productImage3) : upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <label htmlFor="file-input4">
              <img src={productImage4 ? URL.createObjectURL(productImage4) : upload_area} className='addproduct-thumbnail-img' alt="" />
            </label>
            <input accept='image/*' onChange={imageHandler} type="file" id="file-input" hidden />
            <input accept='image/*' onChange={image2Handler} type="file" id="file-input2" hidden />
            <input accept='image/*' onChange={image3Handler} type="file" id="file-input3" hidden />
            <input accept='image/*' onChange={image4Handler} type="file" id="file-input4" hidden />
          </div>
          <div className="add-button">
            <button onClick={handleSubmit} className='addproduct-btn'>ADD PRODUCT</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
