import React, { useState } from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import add_product_icon from '../assets/cart.gif';
import list_product_icon from '../assets/product_list.gif';
import user_icon from '../assets/user.gif';
import leftArrow from '../../../Components/Assets/left-arrow.png'
import orders_icon from '../assets/manage-order.gif';

const Sidebar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className={`sidebar-toggle ${props.mode === 'dark' ? 'invert' : ''}`} onClick={toggleSidebar}>
        <img className='left-arrow' src={leftArrow} alt="" />
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link to='/getAllusers' style={{ textDecoration: 'none' }} onClick={closeSidebar}>
          <div className="sidebar-item">
            <img src={user_icon} alt="Users" />
            <p className='para'>All Users</p>
          </div>
        </Link>
        <Link to='/listproduct' style={{ textDecoration: 'none' }} onClick={closeSidebar}>
          <div className="sidebar-item">
            <img src={list_product_icon} alt="Product List" />
            <p className='para'>Product List</p>
          </div>
        </Link>
        <Link to='/addproduct' style={{ textDecoration: 'none' }} onClick={closeSidebar}>
          <div className="sidebar-item cart-img">
            <img src={add_product_icon} alt="Add Product" />
            <p className='para'>Add Product</p>
          </div>
        </Link>
        <Link to='/admin/orders' style={{ textDecoration: 'none' }} onClick={closeSidebar}>
          <div className="sidebar-item">
            <img src={orders_icon} alt="Orders" />
            <p className='para'>Manage Orders</p>
          </div>
        </Link>
      </div>
    </>
  );
}

export default Sidebar;
