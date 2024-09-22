import React from 'react';
import './Footer.css';
import logo from '../Assets/logo.jpg';
import instagram_icon from '../Assets/instagram_icon.png';
import pinterest_icon from '../Assets/pinterest_icon.png';
import whatsapp_icon from '../Assets/whatsapp_icon.png';
import facebook_icon from '../Assets/facebook_icon.png';
import github_icon from '../Assets/github_icon.png';

const Footer = (props) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className='footer' style={{ color: props.mode === 'light' ? 'dark' : 'light' }}>
      <hr />
      <div className="footer-logo ">
        <img src={logo} alt="A-Kart Logo" />
        <p>A-Kart</p>
      </div>
      <div className="container-box">
        <ul className="footer-links">
          <li><h5>Our Company</h5></li>
          <hr />
          <li>Terms & Conditions</li>
          <li>Privacy Policy</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
        <ul className="footer-links ">
          <li><h5>Quick Links</h5></li>
          <hr />
          <li>Help & Support</li>
          <li>FAQ</li>
          <li>Shipping & Returns</li>
          <li>Payment Options</li>
        </ul>
        <ul className="footer-links ">
          <li><h5>Categories</h5></li>
          <hr />
          <li>Male</li>
          <li>Female</li>
          <li>Kids</li>
        </ul>
        <div className="footer-social-icon">
          <ul className='footer-links '>
            <li><h5>Contact Info</h5></li>
            <hr />
            <li>A-Kart</li>
            <li>Contact: 9567890456</li>
            <li>E-mail: kumarakash91384@gmail.com</li>
          </ul>
          <div className='footer-icons'>
            <div className="footer-icons-container">
              <img src={instagram_icon} alt="Instagram" />
            </div>
            <div className="footer-icons-container">
              <img src={pinterest_icon} alt="Pinterest" />
            </div>
            <div className="footer-icons-container">
              <img src={whatsapp_icon} alt="WhatsApp" />
            </div>
            <div className="footer-icons-container">
              <img src={facebook_icon} alt="Facebook" />
            </div>
            <div className="footer-icons-container">
              <img src={github_icon} alt="GitHub" />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="footer-copyright">
        <p>
          Copyright @ {currentYear} - All Rights Reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer;
