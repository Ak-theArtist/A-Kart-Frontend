import React, { useState, useEffect, useContext } from 'react';
import './Navbar.css';
import { userContext } from '../../App';
import axios from 'axios';
import logo from '../Assets/logo.jpg'; 2
import cart_icon from '../Assets/cart_icon.png';
import profile_icon from '../../Components/Assets/user.png'
import admin_logo from '../../AdminPanel/Components/assets/goku.gif';
import { Link, useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar/ProgressBar';
import { jwtDecode } from 'jwt-decode';
import { ShopContext } from '../../Context/ShopContext';
import { Tooltip, Offcanvas } from 'bootstrap';
import useIntersectionObserver from '../Hooks/Hooks';
import useIntersectionObserverWithTilt from '../Hooks/TiltAnimation';

const Navbar = (props) => {
    useIntersectionObserver('.hidden-navbar', 'show');
    useIntersectionObserver('.animate-left', 'show');
    useIntersectionObserver('.animate-right', 'show');
    useIntersectionObserver('.animate-up', 'show');
    useIntersectionObserverWithTilt('.tilt', 'tilt-show');

    const [menu, setMenu] = useState('shop');
    const [btnText, setBtnText] = useState("Dark Mode");
    const [userData, setUserData] = useState(null);
    const { getTotalCartItems } = useContext(ShopContext);
    const { setIsLoading } = useContext(userContext);
    const user = useContext(userContext);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            setUserData(decodedToken);
        }
    }, [token]);
    // Logout function
    const handleLogout = () => {
        setIsLoading(true);
        axios.get(`https://a-kart-backend.onrender.com/auth/logout`)
            .then(res => {
                if (res.data === "Success") {
                    console.log('Logout successful');
                    localStorage.removeItem('token');
                    localStorage.removeItem('email');
                    localStorage.removeItem('password');
                    localStorage.removeItem('cartItems');
                    navigate('/login');
                    window.location.reload();
                }
            })
            .catch(err => {
                console.error('Error during logout:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    useEffect(() => {
        setBtnText(props.mode === 'light' ? "Dark Mode" : "Light Mode");
    }, [props.mode]);

    useEffect(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map((tooltipTriggerEl) => new Tooltip(tooltipTriggerEl));
    }, []);

    // Handle click outside of offcanvas
    useEffect(() => {
        const handleClickOutside = (event) => {
            const offcanvasElement = document.getElementById('offcanvasSidebar');
            const toggler = document.querySelector('.navbar-toggler');
            const closeButton = document.querySelector('.close-btn');
            const navMenuItems = document.querySelectorAll('.nav-menu li');
            const navLoginCartItems = document.querySelectorAll('.nav-login-cart button, .nav-login-cart a');

            const isOffcanvasClicked = offcanvasElement.contains(event.target);
            const isTogglerClicked = toggler.contains(event.target);
            const isCloseButtonClicked = closeButton.contains(event.target);
            const isNavMenuItemClicked = Array.from(navMenuItems).some(item => item.contains(event.target));
            const isNavLoginCartItemClicked = Array.from(navLoginCartItems).some(item => item.contains(event.target));

            if (offcanvasElement && !isOffcanvasClicked && !isTogglerClicked) {
                const bsOffcanvas = Offcanvas.getInstance(offcanvasElement);
                if (bsOffcanvas) {
                    bsOffcanvas.hide();
                }
            }

            if (isCloseButtonClicked || isNavMenuItemClicked || isNavLoginCartItemClicked) {
                closeOffcanvas();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Close offcanvas
    const closeOffcanvas = () => {
        const offcanvasElement = document.getElementById('offcanvasSidebar');
        const bsOffcanvas = Offcanvas.getInstance(offcanvasElement);
        if (bsOffcanvas) {
            bsOffcanvas.hide();
        }
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get('https://a-kart-backend.onrender.com/auth/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(err => {
                    console.error('Error fetching user:', err);
                });
        } else {
            console.error('No token found');
        }
    }, []);


    return (
        <>
            <ProgressBar />
            <nav className={`fixed navbar container-fluid navbar-expand-lg navbar-${props.mode} bgColor-${props.mode}`}>
                <div className={`container-fluid navbar-${props.mode} bgColor-${props.mode}`}>
                    <Link to="/">
                        <img className='animate-up logo-main' src={logo} alt="Logo" />
                    </Link>
                    <Link className="navbar-brand animate-up" to="/">A-Kart</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`offcanvas offcanvas-end text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? '#ebeaea' : 'dark'}`} tabIndex="-1" id="offcanvasSidebar" data-bs-scroll="true" aria-labelledby="offcanvasSidebarLabel">
                        <div className={`offcanvas-header text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? '#ebeaea' : 'dark'}`}>
                            <h5 className="offcanvas-title" id="offcanvasSidebarLabel">A-Kart</h5>
                            <button type="button" className={`btn-close ${props.mode === 'dark' ? 'invert' : ''} close-btn`} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div className={`offcanvas-body text-${props.mode === 'dark' ? 'light' : 'dark'} bgColor-${props.mode === 'light' ? '#ebeaea' : 'dark'}`}>
                            <ul className="navbar-nav me mb-lg-0 nav-menu">
                                {userData && userData.role === 'admin' && (
                                    <li className='admin-nav' onClick={() => { setMenu("admin"); closeOffcanvas(); }}>
                                        <Link to="/admin" className="admin-link">
                                            <img className='admin-logo' src={admin_logo} alt="Admin Logo" />Admin{menu === 'admin' && <hr />}
                                        </Link>
                                    </li>
                                )}
                                <li onClick={() => { setMenu("shop"); closeOffcanvas(); }} className="nav-item animate-left">
                                    <Link className="nav-link active" aria-current="page" to="/">Shop{menu === 'shop' && <hr />}</Link>
                                </li>
                                <li onClick={() => { setMenu("men"); closeOffcanvas(); }} className="nav-item animate-left">
                                    <Link className="nav-link" to="/men">Men{menu === 'men' && <hr />}</Link>
                                </li>
                                <li onClick={() => { setMenu("women"); closeOffcanvas(); }} className="nav-item animate-left">
                                    <Link className="nav-link" to="/women">Women{menu === 'women' && <hr />}</Link>
                                </li>
                                <li onClick={() => { setMenu("kids"); closeOffcanvas(); }} className="nav-item animate-left">
                                    <Link className="nav-link" to="/kids">Kids{menu === 'kids' && <hr />}</Link>
                                </li>
                            </ul>
                            <form className="d-flex nav-login-cart align-items-center" role="search">
                                <div className={`dark-mode-switch form-check form-switch text-${props.mode === 'dark' ? 'light' : 'dark'}`}>
                                    <label className="switch form-check-label animate-right" htmlFor="flexSwitchCheckDefault">
                                        <input
                                            className="checkbox form-check-input animate-right"
                                            type="checkbox"
                                            role="switch"
                                            id="flexSwitchCheckDefault"
                                            onClick={() => {
                                                props.changeMode();
                                                setBtnText(props.mode === 'light' ? "Dark Mode" : "Light Mode");
                                            }}
                                        />
                                        <div className="slider"></div>
                                        {btnText}
                                    </label>
                                </div>
                                {token ? (
                                    <div>
                                        <button className="btn btn-outline-light nav-logout-btn" type="button" onClick={handleLogout}>Logout</button>
                                    </div>
                                ) : (
                                    <div>
                                        <Link to="/login" className='animate-right'>
                                            <button className="btn nav-login-btn" type="button" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to log in" data-bs-custom-class="custom-tooltip">
                                                Login
                                            </button>
                                        </Link>
                                    </div>
                                )}
                                {(!userData || userData.role !== 'admin') && (
                                    <>
                                        <Link to="/cart">
                                            <img className={`rotate cart-icon ${props.mode === 'dark' ? 'invert' : ''}`} src={cart_icon} alt="Cart Icon" />
                                        </Link>
                                        <div className="nav-cart-count d-flex justify-content-center">{getTotalCartItems()}</div>
                                    </>
                                )}
                                {(!userData || userData.role !== 'admin') && (
                                    <div className='profile-icon'>
                                        <Link to={`/profile`}>
                                            <img className={`${props.mode === 'dark' ? 'invert' : ''}`} src={profile_icon} alt="Profile Icon" />
                                        </Link>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;