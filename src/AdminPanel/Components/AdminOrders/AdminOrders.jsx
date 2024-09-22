import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminOrders.css';
import Sidebar from '../Sidebar/Sidebar';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        axios.get(`https://a-kart-backend.onrender.com/order/allorders`)
            .then(response => {
                setOrders(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                setIsLoading(false);
            });
    }, []);

    const handleStatusChange = (orderId, newStatus) => {
        axios.put(`https://a-kart-backend.onrender.com/order/updateorder/${orderId}`, { status: newStatus })
            .then(response => {
                setOrders(orders.map(order => order._id === response.data.order._id ? response.data.order : order));
            })
            .catch(error => {
                console.error('Error updating order status:', error);
            });
    };

    const sortOrders = (orders, option) => {
        switch (option) {
            case 'highest-price':
                return [...orders].sort((a, b) => b.totalAmount - a.totalAmount);
            case 'lowest-price':
                return [...orders].sort((a, b) => a.totalAmount - b.totalAmount);
            case 'latest':
                return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'oldest':
                return [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            case 'shipped':
            case 'delivered':
            case 'cancelled':
            case 'pending':
                return [...orders].filter(order => order.status === option);
            default:
                return orders;
        }
    };

    const sortedOrders = sortOrders(orders, sortOption);

    return (
        <>
            <Sidebar />
            <div className='admin-orders'>
                <div className="header">
                    <h4>All Orders</h4>
                    <div className="dropdown">
                        <button className="dropbtn">Sort Orders</button>
                        <div className="dropdown-content">
                            <a href="#" onClick={() => setSortOption('')}>All Orders</a>
                            <a href="#" onClick={() => setSortOption('pending')}>Pending Orders</a>
                            <a href="#" onClick={() => setSortOption('latest')}>Latest Orders</a>
                            <a href="#" onClick={() => setSortOption('oldest')}>Oldest Orders</a>
                            <a href="#" onClick={() => setSortOption('shipped')}>Shipped Orders</a>
                            <a href="#" onClick={() => setSortOption('delivered')}>Delivered Orders</a>
                            <a href="#" onClick={() => setSortOption('cancelled')}>Cancelled Orders</a>
                            <a href="#" onClick={() => setSortOption('highest-price')}>Highest to Lowest Price</a>
                            <a href="#" onClick={() => setSortOption('lowest-price')}>Lowest to Highest Price</a>
                        </div>
                    </div>
                </div>
                {/* <div className="admin-orders-header">
                    <p className="order-id">Order ID</p>
                    <p>Order Date</p>
                    <p>Order Time</p>
                    <p>Total Amount</p>
                    <p>Status</p>
                    <p>Quantity</p>
                </div> */}
                <div className="admin-orders-list">
                    <hr />
                    {isLoading ? <p>Loading...</p> : sortedOrders.map(order => (
                        <React.Fragment key={order._id}>
                            <div className="admin-orders-item">
                                <p className="order-id">Order ID: {order._id}</p>
                                <p>Order date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                <p>Order time: {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                <p>Quantity: {order.items.reduce((total, item) => total + item.quantity, 0)}</p>
                                <p>Total amount: &#8377;{order.totalAmount}</p>
                                <p>Status: <b>{order.status}</b></p>
                                <div className='orderButtons'>
                                    <div className="action-buttons-order">
                                        <button className="dropbtn" onClick={() => handleStatusChange(order._id, 'shipped')}>Set Shipped</button>
                                        <button className="dropbtn" onClick={() => handleStatusChange(order._id, 'delivered')}>Set Delivered</button>
                                        <button className="dropbtn" onClick={() => handleStatusChange(order._id, 'cancelled')}>Set Cancelled</button>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </>
    );
};

export default AdminOrders;
