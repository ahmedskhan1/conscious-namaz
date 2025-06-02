"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationItem, setNotificationItem] = useState(null);
  const [isCartIconAnimating, setIsCartIconAnimating] = useState(false);
  
  // Initialize cart from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error parsing cart from localStorage:', error);
          setCartItems([]);
        }
      }
      
      // Expose addToCart method globally for direct access from payment.js
      window.addToCart = addToCart;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.addToCart;
      }
    };
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cartItems.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('cart');
      }
    }
  }, [cartItems]);
  
  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
        setNotificationItem(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  
  // Handle cart icon animation
  useEffect(() => {
    if (isCartIconAnimating) {
      const timer = setTimeout(() => {
        setIsCartIconAnimating(false);
      }, 1000); // Animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isCartIconAnimating]);
  
  // Add item to cart
  const addToCart = (item) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(cartItem => 
      cartItem.id === item.id || cartItem.name === item.name
    );
    
    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      const updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity = (updatedCart[existingItemIndex].quantity || 1) + 1;
      setCartItems(updatedCart);
      // Set notification for existing item
      setNotificationItem({
        ...updatedCart[existingItemIndex],
        isUpdate: true
      });
    } else {
      // Item doesn't exist, add new item
      setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
      // Set notification for new item
      setNotificationItem({
        ...item,
        quantity: 1,
        isUpdate: false
      });
    }
    
    // Show notification and animate cart icon
    setShowNotification(true);
    setIsCartIconAnimating(true);
  };
  
  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => 
      item.id !== itemId && item.name !== itemId
    ));
  };
  
  // Update item quantity
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId || item.name === itemId) {
        return { ...item, quantity };
      }
      return item;
    }));
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  };
  
  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };
  
  // Calculate total items count
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getItemCount,
    showNotification,
    notificationItem,
    isCartIconAnimating
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
      
      {/* Cart notification */}
      {showNotification && notificationItem && (
        <div className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg z-50 max-w-xs w-full border-l-4 border-primary animate-slideIn">
          <div className="flex items-start">
            {notificationItem.image && (
              <div className="w-12 h-12 mr-3 flex-shrink-0">
                <img 
                  src={notificationItem.image} 
                  alt={notificationItem.name} 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{notificationItem.isUpdate ? 'Updated Cart' : 'Added to Cart'}</h4>
              <p className="text-gray-600 text-sm mt-1">{notificationItem.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Quantity: {notificationItem.quantity} | ₹{notificationItem.price * notificationItem.quantity}
              </p>
            </div>
            <button 
              onClick={() => setShowNotification(false)} 
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
} 