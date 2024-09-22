import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import cross_icon from '../assets/cross_icon.png';
import './ListProduct.css';
import Sidebar from '../Sidebar/Sidebar';
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import EditProduct from '../EditProduct/EditProduct';
import { ShopContext } from '../../../Context/ShopContext';

const ListProduct = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [id, setId] = useState();
  const [allProducts, setAllProducts] = useState([]);
  const { userRole } = useContext(ShopContext);
  const navigate = useNavigate();

  const fetchInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/product/allproducts`);
      setAllProducts(response.data);
    } catch (error) {
      console.error('Error fetching the products', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const removeProduct = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_SERVER_BASE_URL}/product/removeproduct`, { id }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      fetchInfo();
    } catch (error) {
      console.error('Error removing the product', error);
    }
  };

  const showDeleteModal = (id) => {
    setIsDeleteModalOpen(true);
    setId(id);
  };

  const showEditModal = (id) => {
    setIsEditModalOpen(true);
    setId(id);
  };

  const handleDeleteOk = () => {
    setIsDeleteModalOpen(false);
    removeProduct(id);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <Sidebar />
      <div className='listproduct'>
        <h3>All Products</h3>
        <div className="listproduct-format-main">
          <p>Products</p>
          <p className='name'>Title</p>
          <p className="old-price">Old Price</p>
          <p className="new-price">New Price</p>
          <p>Category</p>
          {userRole === 'admin' && <p>Actions</p>}
        </div>
        <div className="listproduct-allproducts">
          <hr />
          {allProducts.map((product) => (
            <React.Fragment key={product._id}>
              <div className="listproduct-format-main listproduct-format">
                <div className="img-listProduct">
                  <img
                    src={product.image[0]}
                    alt=""
                    className="listproduct-product-icon"
                    onClick={() => navigate(`/product/${product._id}`)}
                  />
                </div>
                <p className='name' onClick={() => navigate(`/product/${product._id}`)}>{product.name}</p>
                <p className="old-price">&#8377;{product.old_price}</p>
                <p className="new-price">&#8377;{product.new_price}</p>
                <p>{product.category}</p>
                {userRole === 'admin' && (
                  <div className="action-buttons">
                    <button className="edit-btn" onClick={() => showEditModal(product._id)}>
                      <svg className="edit-svgIcon" viewBox="0 0 512 512">
                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                      </svg>
                    </button>
                    <button className="delete-btn" onClick={() => showDeleteModal(product._id)}>
                      <svg className="delete-svgIcon" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      </div>
      <Modal className='delete-modal' title="Delete Product" open={isDeleteModalOpen} okText="Delete" onOk={handleDeleteOk} onCancel={handleDeleteCancel}>
        <p>Are you sure you want to delete this product?</p>
      </Modal>
      <Modal title="Edit Product" open={isEditModalOpen} onCancel={handleEditCancel} footer={null}>
        <EditProduct productId={id} onClose={handleEditCancel} />
      </Modal>
    </>
  );
};

export default ListProduct;
