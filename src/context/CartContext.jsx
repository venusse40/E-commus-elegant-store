import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

function storageKey(userId) {
  return `veefits_local_cart_${userId || "guest"}`;
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);

  // Load cart from localStorage whenever the logged-in user changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setItems([]);
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey(user.id));
      setItems(stored ? JSON.parse(stored) : []);
    } catch {
      setItems([]);
    }
  }, [isAuthenticated, user]);

  const persist = useCallback(
    (nextItems) => {
      setItems(nextItems);
      if (user) {
        localStorage.setItem(storageKey(user.id), JSON.stringify(nextItems));
      }
    },
    [user]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // product = { id, name, price, image }
  const addToCart = async (product, quantity = 1) => {
    const existing = items.find((item) => item.productId === product.id);
    let next;
    if (existing) {
      next = items.map((item) =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      next = [
        ...items,
        {
          id: `local_${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        },
      ];
    }
    persist(next);
    return { success: true };
  };

  const updateQuantity = async (itemId, quantity) => {
    const next = items.map((item) =>
      item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
    );
    persist(next);
    return { success: true };
  };

  const removeFromCart = async (itemId) => {
    const next = items.filter((item) => item.id !== itemId);
    persist(next);
    return { success: true };
  };

  const clearCart = async () => {
    persist([]);
    return { success: true };
  };

  const value = {
    items,
    itemCount,
    total,
    loading: false,
    error: null,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: () => {},
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