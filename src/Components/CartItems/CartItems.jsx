import React, { useContext, useEffect, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import axios from 'axios';
import gif from '../Assets/tom.gif';
import { useNavigate } from 'react-router-dom';
import { Modal, Alert, Button, Radio, Form } from 'antd';

const CartItems = () => {
    const { allProduct, cartItems, setCartItems, removeFromCart, userId, getTotalCartAmount } = useContext(ShopContext);
    const [isCartFetched, setIsCartFetched] = useState(false);
    const [checkoutModalVisible, setCheckoutModalVisible] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [alert, setAlert] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [pincodes, setPincodes] = useState([]);
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPincode, setSelectedPincode] = useState('');
    const [isProcessingOrder, setIsProcessingOrder] = useState(false);



    // Fetch cart items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                if (!userId) {
                    console.error('User ID not available');
                    return;
                }
                const cartUrl = `https://a-kart-backend.onrender.com/auth/cart/${userId}`;
                const cartResponse = await axios.get(cartUrl, { withCredentials: true });
                const cart = cartResponse.data.cart;
                if (cart) {
                    setCartItems(cart);
                    setIsCartFetched(true);
                } else {
                    console.error('Cart data not found in response:', cartResponse.data);
                }
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (!isCartFetched && userId) {
            fetchCartItems();
        }
    }, [userId, isCartFetched, setCartItems]);

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                if (!userId) {
                    console.error('User ID not available');
                    return;
                }
                const userResponse = await axios.get('https://a-kart-backend.onrender.com/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                const user = userResponse.data;
                setAddresses(user.address || []);
                setPincodes(user.pincode || []);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    // Handle alerts
    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alert]);

    // Fetch addresses (if separate from user details fetch)
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                if (!userId) {
                    console.error('User ID not available');
                    return;
                }
                const addressUrl = `https://a-kart-backend.onrender.com/auth/addresses/${userId}`;
                const addressResponse = await axios.get(addressUrl, { withCredentials: true });
                setAddresses(addressResponse.data.addresses || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        if (userId) {
            fetchAddresses();
        }
    }, [userId]);

    const handleCheckoutClick = () => {
        if (!userId) {
            setAlert({ message: 'Please log in to proceed to checkout', type: 'warning' });
            navigate('/login');
            return;
        }
        setCheckoutModalVisible(true);
    };


    const handleCheckoutModalClose = () => {
        setCheckoutModalVisible(false);
    };

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const handlePlaceOrder = async () => {
        setIsProcessingOrder(true);
        try {
            const items = cartItems.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));
            const totalAmount = getTotalCartAmount();
            if (!userId || !selectedAddress || !selectedPincode) {
                console.error('Required fields are not available');
                setIsProcessingOrder(false);
                return;
            }
    
            // Delay the order placement by 3 seconds
            setTimeout(async () => {
                // Place the order
                await axios.post(`https://a-kart-backend.onrender.com/order/createorder`, {
                    userId,
                    items,
                    totalAmount,
                    paymentMethod,
                    address: selectedAddress,
                    pincode: selectedPincode,
                });
    
                // Clear the cart in the database
                await axios.post(`https://a-kart-backend.onrender.com/auth/removefromcart/${userId}`, { withCredentials: true });
    
                // Clear the cart in the frontend state
                setCartItems([]);
    
                // Show the success alert
                setAlert({ message: 'Order placed successfully!', type: 'success' });
                handleCheckoutModalClose();
                setIsProcessingOrder(false);
            }, 3000); // 3 seconds delay
    
        } catch (error) {
            console.error('Error placing order:', error.message);
            setAlert({ message: 'Error placing order', type: 'error' });
            setIsProcessingOrder(false);
        }
    };    


    const handleAddAddress = () => {
        navigate('/user-profile');
    };

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return (
            <div className='cartitems emptyCart'>
                <img src={gif} alt="" />
                Your cart is empty.
            </div>
        );
    }

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {cartItems.map((item) => {
                const product = allProduct.find(p => p._id === item.productId);
                if (!product) return null;

                return (
                    <div key={item.productId} className="cartitems-format cartitems-format-main">
                        <img
                            src={product.image[0]}
                            alt={product.name}
                            className='carticon-product-icon cursor'
                            onClick={() => navigate(`/product/${item.productId}`)}
                        />
                        <p className='cursor' onClick={() => navigate(`/product/${item.productId}`)}>
                            {product.name}
                        </p>
                        <p className='price'>&#8377;{product.new_price}</p>
                        <p>{item.quantity}</p>
                        <p>&#8377;{item.quantity * product.new_price}</p>
                        <button className='cross-button' onClick={() => removeFromCart(item.productId)}>
                            <svg viewBox="0 0 448 512" className="svgIcon">
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                            </svg>
                        </button>
                    </div>
                );
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>&#8377;{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>&#8377;{getTotalCartAmount()}</h3>
                        </div>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button onClick={handleCheckoutClick}>PROCEED TO CHECKOUT</button>
                    </div>
                </div>
            </div>

            <Modal
                className='checkout-modal'
                title="Proceed to Checkout"
                open={checkoutModalVisible}
                onCancel={handleCheckoutModalClose}
                footer={[
                    <Button key="back" onClick={handleCheckoutModalClose} disabled={isProcessingOrder}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handlePlaceOrder} disabled={isProcessingOrder}>
                        {isProcessingOrder ? 'Processing...' : 'Place Order'}
                    </Button>,
                ]}
            >

                <Form layout="vertical">
                    <Form.Item label="Select Payment Method">
                        <Radio.Group value={paymentMethod} onChange={handlePaymentMethodChange}>
                            <Radio value="Cash on Delivery">Cash on Delivery</Radio>
                            <Radio disabled value="Credit Card">Credit Card</Radio>
                            <Radio disabled value="PayPal">UPI</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Select Address">
                        <select
                            value={selectedAddress}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="" disabled>Select an address</option>
                            {addresses.length > 0 ? (
                                addresses.map((address, index) => (
                                    <option key={index} value={address}>
                                        {address}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No addresses available</option>
                            )}
                        </select>
                        {addresses.length === 0 && <div>Please add an address.</div>}
                    </Form.Item>
                    <Form.Item label="Pincode">
                        <select
                            value={selectedPincode}
                            onChange={(e) => setSelectedPincode(e.target.value)}
                            style={{ width: '100%' }}
                        >
                            <option value="" disabled>Select a pincode</option>
                            {pincodes.length > 0 ? (
                                pincodes.map((pincode, index) => (
                                    <option key={index} value={pincode}>
                                        {pincode}
                                    </option>
                                ))
                            ) : (
                                <option value="" disabled>No pincodes available</option>
                            )}
                        </select>
                        {pincodes.length === 0 && <div>Please add a pincode.</div>}
                    </Form.Item>
                </Form>
            </Modal>

            {alert && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    showIcon
                    style={{ position: 'fixed', right: 10, zIndex: 1000 }}
                />
            )}
        </div>
    );
};

export default CartItems;
