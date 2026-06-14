"use client";

import { createContext, useContext, useReducer, useEffect, useState } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {

    case "ADD_ITEM": {
      const existing = state.find((i) => i._id === action.item._id);

      if (existing) {
        return state.map((i) =>
          i._id === action.item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...state, { ...action.item, quantity: 1 }];
    }

    case "REMOVE_ITEM":
      return state.filter((i) => i._id !== action.id);

    case "INCREASE_QTY":
      return state.map((i) =>
        i._id === action.id ? { ...i, quantity: i.quantity + 1 } : i
      );

    case "DECREASE_QTY":
      return state
        .map((i) =>
          i._id === action.id ? { ...i, quantity: i.quantity - 1 } : i
        )

        .filter((i) => i.quantity > 0);

    case "CLEAR_CART":
      return [];

    case "SET_CART":

      return action.items;

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("chowdesk_cart");
    if (saved) {
      dispatch({ type: "SET_CART", items: JSON.parse(saved) });
    }
    setIsLoaded(true);
  }, []);

 
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("chowdesk_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // ── Helper functions exposed to components ──────────────
  const addToCart = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeFromCart = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const increaseQty = (id) => dispatch({ type: "INCREASE_QTY", id });
  const decreaseQty = (id) => dispatch({ type: "DECREASE_QTY", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  // ── Derived values (computed every render, always in sync) ─
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    clearCart,
    totalItems,
    totalPrice,
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