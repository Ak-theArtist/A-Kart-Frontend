import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import pendingGif from '../../Components/Assets/pending.png';
import shippedGif from '../../Components/Assets/shipped.png';
import deliveredGif from '../../Components/Assets/delivered.png';
import cancelledGif from '../../Components/Assets/cancelled.png';
import loginfirst from '../../Components/Assets/login-first.gif';
import './UserProfile.css';
import rightArrow from '../../Components/Assets/right-arrow.png'
import { ShopContext } from '../../Context/ShopContext';

const UserProfile = (props) => {
    const [userDetails, setUserDetails] = useState({ orders: [] });
    const [userData, setUserData] = useState(null);
    const [orderStatuses, setOrderStatuses] = useState({});
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [pincodes, setPincodes] = useState([]);
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [isAddingPincode, setIsAddingPincode] = useState(false);


    const [originalAddresses, setOriginalAddresses] = useState([]);
    const [originalPincodes, setOriginalPincodes] = useState([]);


    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        gender: 'Male',
        mobileNumber: '',
        pincode: ''
    });
    const [isEditingField, setIsEditingField] = useState({
        name: false,
        email: false,
        address: false,
        gender: false,
        mobileNumber: false,
        pincode: false
    });
    const [updateMessage, setUpdateMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [currentView, setCurrentView] = useState('personalInformation');

    const { userId, cartItems, allProduct, setIsLoading } = useContext(ShopContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (userId) {
            setIsLoading(true);
            axios.get('https://a-kart-backend.onrender.com/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(res => {
                    setUserDetails(prev => ({
                        ...res.data,
                        orders: res.data.orders || []
                    }));
                    setFormData({
                        name: res.data.name,
                        email: res.data.email,
                        address: res.data.address || '',
                        gender: res.data.gender || 'Male',
                        mobileNumber: res.data.mobileNumber || '',
                        pincode: res.data.pincode || ''
                    });
                    setAddresses(res.data.address || []);
                    setPincodes(res.data.pincode || []);
                    setOriginalAddresses(res.data.address || []);
                    setOriginalPincodes(res.data.pincode || []);
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        }
    }, [userId, setIsLoading]);

    // Fetch logged-in user data
    useEffect(() => {
        axios.get('https://a-kart-backend.onrender.com/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        })
            .then(res => {
                setUserData(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (userId && userDetails.orders.length > 0) {
            setIsLoading(true);
            axios.get(`https://a-kart-backend.onrender.com/order/ordersforuser`, {
                withCredentials: true,
                params: { userId }
            })
                .then(res => {
                    const statuses = {};
                    if (Array.isArray(res.data.orders)) {
                        res.data.orders.forEach(order => {
                            statuses[order._id] = order.status;
                        });
                        setOrderStatuses(statuses);
                        setUserDetails(prev => ({ ...prev, orders: res.data.orders }));
                    } else {
                        console.error('Invalid data format: Orders should be an array.');
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching order statuses:', err.response?.data || err.message);
                    setIsLoading(false);
                });
        }
    }, [userId, userDetails.orders.length, setIsLoading]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }, []);

    const handleGenderChange = useCallback((e) => {
        setFormData(prev => ({ ...prev, gender: e.target.value }));
        setValidationErrors(prev => ({ ...prev, gender: '' }));
    }, []);

    const toggleEditField = (field) => {
        setIsEditingField(prev => ({
            name: false,
            email: false,
            address: false,
            gender: false,
            mobileNumber: false,
            pincode: false,
            [field]: true
        }));
        setValidationErrors({});
    };

    const handleCancelEdit = (field) => {
        setIsEditingField(prev => ({ ...prev, [field]: false }));
        setFormData({
            name: userDetails.name,
            email: userDetails.email,
            address: userDetails.address || '',
            gender: userDetails.gender || 'Male',
            mobileNumber: userDetails.mobileNumber || '',
            pincode: userDetails.pincode || ''
        });
    };

    const validateInput = (field, value) => {
        let error = '';
        if (field === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = 'Invalid email address';
            }
        } else if (field === 'mobileNumber') {
            if (!/^\d{10}$/.test(value)) {
                error = 'Mobile number must be 10 digits';
            }
        } else if (field === 'pincode') {
            if (!/^\d{6}$/.test(value)) {
                error = 'Pincode must be 6 digits';
            }
        }
        setValidationErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleSubmit = useCallback(async (event, field) => {
        event.preventDefault();
        validateInput(field, formData[field]);
        if (validationErrors[field]) {
            return;
        }
        const { pincode, ...updateData } = formData;
        try {
            const response = await axios.put(
                `https://a-kart-backend.onrender.com/auth/updateProfile`,
                { ...updateData, userId },
                { withCredentials: true }
            );
            setUserDetails(prev => ({ ...prev, [field]: response.data[field] }));
            setIsEditingField(prev => ({ ...prev, [field]: false }));
        } catch (error) {
            console.error('Error updating profile:', error.response || error);
            window.alert('Error updating profile.');
        }
    }, [formData, userId, validationErrors]);


    const handleGoToCart = useCallback(() => {
        navigate('/cart');
    }, [navigate]);

    const handleProductClick = useCallback((productId) => {
        navigate(`/product/${productId}`);
    }, [navigate]);

    const fieldLabels = {
        name: 'Name',
        email: 'Email',
        address: 'Address',
        gender: 'Gender',
        mobileNumber: 'Mobile',
        pincode: 'Pincode'
    };

    const getTimeBasedGreeting = () => {
        const currentHour = new Date().getHours();
        if (currentHour < 12) {
            return 'Good Morning !';
        } else if (currentHour < 18) {
            return 'Good Afternoon !';
        } else {
            return 'Good Evening !';
        }
    };

    const getStatusClass = (status) => {
        if (!status) {
            return '';
        }

        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'pending':
                return 'status-pending';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };


    const getStatusGif = (status) => {
        if (!status) {
            return '';
        }

        const normalizedStatus = status.toLowerCase();

        switch (normalizedStatus) {
            case 'pending':
                return pendingGif;
            case 'shipped':
                return shippedGif;
            case 'delivered':
                return deliveredGif;
            case 'cancelled':
                return cancelledGif;
            default:
                return '';
        }
    };


    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const handleChangeAddress = (index, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = value;
        setAddresses(newAddresses);
    };

    const handleChangePincode = (index, value) => {
        const newPincodes = [...pincodes];
        newPincodes[index] = value;
        setPincodes(newPincodes);
    };
    const hasChanges = () => {
        return JSON.stringify(addresses) !== JSON.stringify(originalAddresses) ||
            JSON.stringify(pincodes) !== JSON.stringify(originalPincodes);
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`https://a-kart-backend.onrender.com/auth/updateAddress`, {
                userId,
                address: addresses,
                pincode: pincodes
            }, { withCredentials: true });
            window.alert('Addresses and pincodes updated successfully.');
        } catch (error) {
            console.error('Error updating addresses and pincodes:', error);
            window.alert('Error updating addresses and pincodes.');
        }
    };
    const handleAddAddress = () => {
        setAddresses([...addresses, '']);
        setIsAddingAddress(true);
    };

    const handleAddPincode = () => {
        setPincodes([...pincodes, '']);
        setIsAddingPincode(true);
    };

    const handleCancelAddressEdit = () => {
        setAddresses([...originalAddresses]);
        setIsAddingAddress(false);
    };

    const handleCancelPincodeEdit = () => {
        setPincodes([...originalPincodes]);
        setIsAddingPincode(false);
    };

    const handleDeleteAddress = async (index) => {
        try {
            const addressToDelete = addresses[index];
            await axios.delete(`https://a-kart-backend.onrender.com/auth/deleteAddress`, {
                data: { userId, address: addressToDelete },
                withCredentials: true
            });
            setAddresses(prev => prev.filter((_, i) => i !== index));
            window.alert('Address deleted successfully.');
        } catch (error) {
            console.error('Error deleting address:', error);
            window.alert('Error deleting address.');
        }
    };

    const handleDeletePincode = async (index) => {
        try {
            const pincodeToDelete = pincodes[index];
            await axios.delete(`https://a-kart-backend.onrender.com/auth/deletePincode`, {
                data: { userId, pincode: pincodeToDelete },
                withCredentials: true
            });
            setPincodes(prev => prev.filter((_, i) => i !== index));
            window.alert('Pincode deleted successfully.');
        } catch (error) {
            console.error('Error deleting pincode:', error);
            window.alert('Error deleting pincode.');
        }
    };


    return (
        <div className="user-profile">
            {userDetails && (
                <div>
                    {userData ? (
                        <>
                            <button
                                className={`toggle-button text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? 'light' : 'dark'}`}
                                onClick={toggleSidebar}
                            >
                                <img className='right-arrow' src={rightArrow} alt="" />
                            </button>
                            <div
                                className={`overlay ${isSidebarOpen ? 'active' : ''}`}
                                onClick={toggleSidebar}
                            ></div>
                            <div
                                className={`left-container ${isSidebarOpen ? 'active' : ''} text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? 'light' : 'dark'}`}
                            >
                                <button
                                    className={`close-button text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? 'light' : 'dark'}`}
                                    onClick={toggleSidebar}
                                >
                                    ✖
                                </button>
                                <div className="greetings box">
                                    <h5 className="mb-4">
                                        <b>H</b>ello <span className="user-name">{userDetails ? userDetails.name : 'Dear User'}</span>,<br /> {getTimeBasedGreeting()}
                                    </h5>
                                    <hr />
                                </div>
                                <div className="account-settings box mt-4 flex-column align-items-center">
                                    <h5 className="mb-3 text-center"><b>Account Settings</b></h5>
                                    <ul className="ul-tag">
                                        <li className="links" onClick={() => { setCurrentView('personalInformation'); toggleSidebar(); }}>Personal Information</li>
                                        <li className="links" onClick={() => { setCurrentView('manageAddress'); toggleSidebar(); }}>Manage Address</li>
                                    </ul>
                                </div>
                                <div className="cart-orders box">
                                    <h5 className="mb-3 text-center"><b>Your Orders</b></h5>
                                    <ul className="ul-tag">
                                        <li className="links" onClick={() => { setCurrentView('yourCart'); toggleSidebar(); }}>Your Cart</li>
                                        <li className="links" onClick={() => { setCurrentView('trackOrder'); toggleSidebar(); }}>Track Your Order</li>
                                    </ul>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            )}
            <div className="right-container">
                {userData ? (
                    <>
                        {currentView === 'personalInformation' && (
                            <div className='right-main'>
                                {['name', 'email', 'mobileNumber'].map(field => (
                                    <div className='details' key={field}>
                                        <p><strong>{fieldLabels[field]}:</strong></p>
                                        {!isEditingField[field] ? (
                                            <p className='data'>{userDetails[field] || 'N/A'}
                                                <button className="edit-btn" onClick={() => toggleEditField(field)}>
                                                    <svg className="edit-svgIcon" viewBox="0 0 512 512">
                                                        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                                    </svg>
                                                </button>
                                            </p>
                                        ) : (
                                            <form onSubmit={(event) => handleSubmit(event, field)} className={`text-${props.mode === 'dark' ? 'light' : 'dark'}`}>
                                                <input
                                                    className="form-control"
                                                    type={field === 'email' ? 'email' : 'text'}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    onBlur={() => validateInput(field, formData[field])}
                                                    required={true}
                                                />
                                                {validationErrors[field] && <p className="error-message">{validationErrors[field]}</p>}
                                                <button className='submit-button' type="submit">Update</button>
                                                <button className='cancel-button' type="button" onClick={() => handleCancelEdit(field)}>Cancel</button>
                                            </form>
                                        )}
                                    </div>
                                ))}
                                <div className='details'>
                                    <p><strong>Gender:</strong></p>
                                    {!isEditingField.gender ? (
                                        <p className='data'>{userDetails.gender || 'N/A'}
                                            <button className="edit-btn" onClick={() => toggleEditField('gender')}>
                                                <svg className="edit-svgIcon" viewBox="0 0 512 512">
                                                    <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                                                </svg>
                                            </button>
                                        </p>
                                    ) : (
                                        <form onSubmit={(event) => handleSubmit(event, 'gender')}>
                                            <div className='genders'>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Male"
                                                        checked={formData.gender === 'Male'}
                                                        onChange={handleGenderChange}
                                                    />
                                                    Male
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Female"
                                                        checked={formData.gender === 'Female'}
                                                        onChange={handleGenderChange}
                                                    />
                                                    Female
                                                </label>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Other"
                                                        checked={formData.gender === 'Other'}
                                                        onChange={handleGenderChange}
                                                    />
                                                    Other
                                                </label>
                                            </div>
                                            <button className='submit-button' type="submit">Update</button>
                                            <button className='cancel-button' type="button" onClick={() => handleCancelEdit('gender')}>Cancel</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )}
                        {currentView === 'manageAddress' && (
                            <div className='right-main-address'>
                                <div className='manage-add-container'>
                                    <h4 className='section-title'>Manage Addresses</h4>
                                    {addresses.map((address, index) => (
                                        <div key={index} className='address-div address-container'>
                                            <input
                                                type='text'
                                                value={address}
                                                onChange={(e) => handleChangeAddress(index, e.target.value)}
                                                placeholder="Enter address"
                                                className={`address-textarea inp-1 text-${props.mode === 'dark' ? 'light' : 'dark'}`}
                                                required={true}
                                            />
                                            <button className='dlt-btn' onClick={() => handleDeleteAddress(index)}>Delete</button>
                                        </div>
                                    ))}
                                    <button className='add-btn' onClick={handleAddAddress}>Add Address</button>
                                    {isAddingAddress && (
                                        <button className='cancel-btn' onClick={handleCancelAddressEdit}>Cancel</button>
                                    )}
                                </div>
                                <div className='manage-add-container'>
                                    <h4 className='section-title'>Manage Pincodes</h4>
                                    {pincodes.map((pincode, index) => (
                                        <div key={index} className='address-div pincode-container'>
                                            <input
                                                value={pincode}
                                                onChange={(e) => handleChangePincode(index, e.target.value)}
                                                placeholder="Enter pincode"
                                                className={`pincode-textarea text-${props.mode === 'dark' ? 'light' : 'dark'}`}
                                                required={true}
                                            />
                                            <button className='dlt-btn' onClick={() => handleDeletePincode(index)}>Delete</button>
                                        </div>
                                    ))}
                                    <button className='add-btn' onClick={handleAddPincode}>Add Pincode</button>
                                    {isAddingPincode && (
                                        <button className='cancel-btn' onClick={handleCancelPincodeEdit}>Cancel</button>
                                    )}
                                </div>
                                {hasChanges() && <button className='save-changes-btn' onClick={handleSaveChanges}>Save Changes</button>}
                            </div>
                        )}

                        {currentView === 'yourCart' && (
                            <div className='cart-items'>
                                <h5>Your Cart Items</h5>
                                {cartItems.length > 0 ? (
                                    <ul>
                                        {cartItems.map(item => {
                                            const product = allProduct.find(p => p._id === item.productId);
                                            return product ? (
                                                <li className='list-item' key={item.productId}>
                                                    <img
                                                        className='image'
                                                        src={product.image[0]}
                                                        alt={product.name}
                                                        style={{ width: '40px', height: '50px' }}
                                                        onClick={() => handleProductClick(item.productId)}
                                                    />
                                                    <div className='cart-products' onClick={() => handleProductClick(item.productId)}>
                                                        <p className='product-name'>{product.name}</p>
                                                        <p>Quantity: {item.quantity}</p>
                                                    </div>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                ) : (
                                    <p>No current Items.</p>
                                )}
                                <button className="goCart" onClick={handleGoToCart}>
                                    <span className="IconContainer">
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512" fill="rgb(17, 17, 17)" className="cart">
                                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                                        </svg>
                                    </span>
                                    <span className="CartText">Go to Cart</span>
                                </button>
                            </div>
                        )}
                        {currentView === 'trackOrder' && (
                            userDetails.orders.length > 0 ? (
                                userDetails.orders
                                    .slice()
                                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                    .map(order => {
                                        const itemsGroupedByDate = Array.isArray(order.items) ? order.items.reduce((acc, item) => {
                                            const orderDate = new Date(order.createdAt).toLocaleDateString();
                                            if (!acc[orderDate]) {
                                                acc[orderDate] = [];
                                            }
                                            acc[orderDate].push(item);
                                            return acc;
                                        }, {}) : {};

                                        return (
                                            <div key={order._id} className='order-details'>
                                                <div className='right-text'>
                                                    <h6>Order ID: {order._id}</h6>
                                                    <p className={`status ${getStatusClass(orderStatuses[order._id])}`}>
                                                        <b>Status: {orderStatuses[order._id]}</b>
                                                    </p>
                                                    {Object.entries(itemsGroupedByDate).map(([date, items]) => (
                                                        <div key={date} className='order-date-group'>
                                                            <p><b>Order Date:</b> {date}</p>
                                                            {items.map(item => (
                                                                <div key={item.productId._id} className='order-item'>
                                                                    <div className='ordered-image'>
                                                                        <img
                                                                            src={item.productId.image[0]}
                                                                            alt={item.productId.name}
                                                                            onClick={() => handleProductClick(item.productId._id)}
                                                                        />
                                                                    </div>
                                                                    <div className='d-flex flex-column justify-content-center'>
                                                                        <p>Name: {item.productId.name}</p>
                                                                        <p>Quantity: {item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}

                                                    <p><strong>Total Amount: &#8377;{order.totalAmount}</strong></p>
                                                    <p><strong>Address:</strong> {order.address}</p>
                                                    <p><strong>Pincode:</strong> {order.pincode}</p>
                                                </div>
                                                <img
                                                    className='status-gif gif-photo'
                                                    src={getStatusGif(orderStatuses[order._id])}
                                                    alt={orderStatuses[order._id]}
                                                />
                                            </div>
                                        );
                                    })
                            ) : (
                                <p>No orders found.</p>
                            )
                        )}
                    </>
                ) : (
                    <div className='without-login'>
                        <strong>You Have To Login First...</strong>
                        <img className='gif-img' src={loginfirst} alt="" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
