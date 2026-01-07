import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (item, quantity = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p._id === item._id);
      if (found) {
        return prev.map((p) =>
          p._id === item._id ? { ...p, qty: p.qty + quantity } : p
        );
      }
      return [...prev, { ...item, qty: quantity }];
    });
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((p) => p._id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) return removeFromCart(id);
    setItems((prev) =>
      prev.map((p) => (p._id === id ? { ...p, qty } : p))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const total = items.reduce((sum, it) => sum + (it.price * it.qty), 0);
  const itemCount = items.reduce((sum, it) => sum + it.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
