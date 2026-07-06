import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from "../api/cartApi";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null); // raw cart object from API
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const items = cart?.items || [];

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const total = items.reduce((sum, item) => {
    const price = item.variant?.price ?? item.price ?? 0;
    return sum + price * (item.quantity || 0);
  }, 0);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data.cart || data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load your cart."
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async ({ productId, variantId, quantity = 1 }) => {
  setError(null);
  try {
    await addItemToCart({ productId, variantId, quantity });
    await fetchCart();
    return { success: true };
  } catch (err) {
    const message =
      err.response?.data?.message || "Could not add item to cart.";
    setError(message);
    return { success: false, message };
  }
};

  const updateQuantity = async (itemId, quantity) => {
    setError(null);
    try {
      await updateCartItem(itemId, quantity);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not update quantity.";
      setError(message);
      return { success: false, message };
    }
  };

  const removeFromCart = async (itemId) => {
    setError(null);
    try {
      await removeCartItem(itemId);
      await fetchCart();
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not remove item.";
      setError(message);
      return { success: false, message };
    }
  };

  const clearCart = async () => {
    setError(null);
    try {
      await clearCartApi();
      await fetchCart();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Could not clear cart.";
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    cart,
    items,
    itemCount,
    total,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}