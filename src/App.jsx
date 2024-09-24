import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import LoginSignup from './Pages/LoginSignup';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';
import { createContext, useState, useEffect } from 'react';
import Loading from './Components/Loading/Loading';
import axios from 'axios';
import Admin from './Pages/Admin';
import ListProduct from './AdminPanel/Components/ListProduct/ListProduct';
import AddProduct from './AdminPanel/Components/AddProduct/AddItems';
import AllUsers from './AdminPanel/Components/AllUsers/AllUsers';
import ProtectedRoute from './Pages/ProtectedRoute';
import ErrorPage from './Pages/ErrorPage';
import EditProduct from './AdminPanel/Components/EditProduct/EditProduct';
import UserProfile from './Components/UserProfile/UserProfile';
import AdminOrders from './AdminPanel/Components/AdminOrders/AdminOrders';
import NoRoute from './Pages/NoRoute';

export const userContext = createContext();

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [adminInfo, setAdminInfo] = useState(null);
  const [mode, setMode] = useState('light');
  const token = localStorage.getItem('token');

  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : 'auto';
  }, [isLoading]);

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get('https://a-kart-backend.onrender.com/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAdminInfo(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAdminInfo();
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const changeMode = () => {
    if (mode === 'dark') {
      setMode('light');
      document.body.style.backgroundColor = 'rgba(234, 232, 232, 0.905)';
      document.body.style.color = 'rgba(34, 33, 33, 0.877)';
    } else {
      setMode('dark');
      document.body.style.backgroundColor = 'rgb(8, 17, 26)';
      document.body.style.color = 'whitesmoke';
    }
  };

  return (
    <userContext.Provider value={{ user, setUser, setIsLoading }}>
      <HashRouter>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Navbar mode={mode} changeMode={changeMode} />
            <Routes>
              <Route exact path="/" element={<Shop />} />
              <Route exact path="/men" element={<ShopCategory banner={men_banner} category="men" />} />
              <Route exact path="/women" element={<ShopCategory banner={women_banner} category="women" />} />
              <Route exact path="/kids" element={<ShopCategory banner={kid_banner} category="kid" />} />
              <Route path="/profile" element={<UserProfile mode={mode} changeMode={changeMode} />} />
              <Route path='/addproduct' element={<ProtectedRoute element={AddProduct} />} />
              <Route path='/editproduct/:id' element={<ProtectedRoute element={EditProduct} />} />
              <Route path='/listproduct' element={<ProtectedRoute element={ListProduct} />} />
              <Route path="/admin/orders" element={<ProtectedRoute element={AdminOrders} />} />
              <Route path='/getAllusers' element={<ProtectedRoute element={AllUsers} />} />
              <Route path="/admin" element={<ProtectedRoute element={Admin} />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route path="/login" element={token ? <Navigate to="/" replace /> : <LoginSignup />} />
              <Route path="*" element={<NoRoute />} />
            </Routes>
            <ConditionalFooter />
          </>
        )}
      </HashRouter>
    </userContext.Provider>
  );
}

function ConditionalFooter() {
  const location = useLocation();
  return location.pathname !== '/admin' ? <Footer /> : null;
}

export default App;
