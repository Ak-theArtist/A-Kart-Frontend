import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddProduct/AddProduct.css'
import './EditProduct.css';
import upload_area from '../../Components/assets/upload_area.svg';

const EditProduct = ({ productId, onClose }) => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [old_price, setOld_price] = useState('');
  const [new_price, setNew_price] = useState('');
  const [productDescription, setProductDescription] = useState(''); 
  const [productImage1, setProductImage1] = useState(null);
  const [productImage2, setProductImage2] = useState(null);
  const [productImage3, setProductImage3] = useState(null);
  const [productImage4, setProductImage4] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`https://a-kart-backend.onrender.com/product/${productId}`);
        if (res.data.success) {
          const productData = res.data.product;
          setProductName(productData.name);
          setCategory(productData.category);
          setOld_price(productData.old_price);
          setNew_price(productData.new_price);
          setProductDescription(productData.description); 
          if (productData.image) {
            setProductImage1(productData.image[0]);
            setProductImage2(productData.image[1]);
            setProductImage3(productData.image[2]);
            setProductImage4(productData.image[3]);
          }
        } else {
          console.error('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://a-kart-backend.onrender.com/product/editproduct/${productId}`, {
      name: productName,
      category,
      old_price,
      new_price,
      description: productDescription, 
    })
      .then(res => {
        console.log(res);
        window.location.reload();
        onClose();
      })
      .catch(err => console.log(err));
  };

  const handleImageUpload = async (e, imageIndex) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const res = await axios.put(`https://a-kart-backend.onrender.com/product/updateimage${imageIndex}/${productId}`, formData);
      console.log(res);
      if (imageIndex === 1) setProductImage1(URL.createObjectURL(file));
      if (imageIndex === 2) setProductImage2(URL.createObjectURL(file));
      if (imageIndex === 3) setProductImage3(URL.createObjectURL(file));
      if (imageIndex === 4) setProductImage4(URL.createObjectURL(file));
    } catch (err) {
      console.error(`Error uploading image ${imageIndex}:`, err);
    }
  };

  return (
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
      <div className="addproduct-itemfield images">
        <label htmlFor="file-input1">
          <img src={productImage1 ? productImage1 : upload_area} className='editproduct-thumbnail-img' alt="" />
        </label>
        <label htmlFor="file-input2">
          <img src={productImage2 ? productImage2 : upload_area} className='editproduct-thumbnail-img' alt="" />
        </label>
        <label htmlFor="file-input3">
          <img src={productImage3 ? productImage3 : upload_area} className='editproduct-thumbnail-img' alt="" />
        </label>
        <label htmlFor="file-input4">
          <img src={productImage4 ? productImage4 : upload_area} className='editproduct-thumbnail-img' alt="" />
        </label>
        <input accept='image/*' onChange={(e) => handleImageUpload(e, 1)} type="file" id="file-input1" hidden />
        <input accept='image/*' onChange={(e) => handleImageUpload(e, 2)} type="file" id="file-input2" hidden />
        <input accept='image/*' onChange={(e) => handleImageUpload(e, 3)} type="file" id="file-input3" hidden />
        <input accept='image/*' onChange={(e) => handleImageUpload(e, 4)} type="file" id="file-input4" hidden />
      </div>
      <div className="add-button">
        <button onClick={handleSubmit} className='addproduct-btn'>UPDATE PRODUCT</button>
      </div>
    </div>
  );
};

export default EditProduct;
