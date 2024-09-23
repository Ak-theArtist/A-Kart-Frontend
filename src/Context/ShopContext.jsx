import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProduct, setAllProduct] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`https://a-kart-backend.onrender.com/product/allproducts`)
      .then((response) => {
        setAllProduct(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });

    const fetchUserIdAndCart = async () => {
      try {
        const userResponse = await axios.get('https://a-kart-backend.onrender.com/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const user = userResponse.data;
        setUserId(user._id);
        setUserRole(user.role);

        const cartResponse = await axios.get(`https://a-kart-backend.onrender.com/auth/cart/${user._id}`, {
          withCredentials: true,
        });
        setCartItems(cartResponse.data.cart);
      } catch (error) {
        console.error('Error fetching user ID or cart items:', error);
        const storedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
        setCartItems(storedCart);
      }
    };

    fetchUserIdAndCart();
  }, []);

  const addToCart = async (productId) => {
    try {
      if (!userId) {
        const updatedCart = [...cartItems];
        const cartItem = updatedCart.find(item => item.productId === productId);
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          updatedCart.push({ productId, quantity: 1 });
        }
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return;
      }

      const response = await axios.post(
        `https://a-kart-backend.onrender.com/auth/addtocart/${userId}`,
        { productId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart);
      console.log('Item added to cart:', response.data.cart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (!userId) {
        const updatedCart = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        return;
      }

      const response = await axios.post(
        `https://a-kart-backend.onrender.com/auth/removefromcart/${userId}`,
        { productId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setCartItems(response.data.cart);
      console.log('Item removed from cart:', response.data.cart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      const product = allProduct.find((p) => p._id === item.productId);
      if (product) {
        totalAmount += item.quantity * product.new_price;
      }
    });
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    cartItems.forEach((item) => {
      totalItems += item.quantity;
    });
    return totalItems;
  };

  const syncLocalCartToServer = async () => {
    if (userId) {
      const localCart = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (localCart.length > 0) {
        await Promise.all(localCart.map(async (item) => {
          await addToCart(item.productId);
        }));
        localStorage.removeItem("cartItems");
      }
    }
  };

  useEffect(() => {
    syncLocalCartToServer();
  }, [userId]);

  const contextValue = {
    userId,
    userRole,
    getTotalCartItems,
    getTotalCartAmount,
    allProduct,
    cartItems,
    addToCart,
    syncLocalCartToServer,
    removeFromCart,
    setCartItems,
    isLoading,
    setIsLoading
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
