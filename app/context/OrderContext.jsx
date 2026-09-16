"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
  const [items, setItems] = useState([]);

  // Cart drawer state
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToOrder = (item) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (orderItem) => orderItem.id === item.id
      );

      if (existingItem) {
        return currentItems.map((orderItem) =>
          orderItem.id === item.id
            ? {
                ...orderItem,
                quantity: orderItem.quantity + 1,
              }
            : orderItem
        );
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromOrder = (itemId) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === itemId
      );

      if (!existingItem) {
        return currentItems;
      }

      if (existingItem.quantity === 1) {
        return currentItems.filter(
          (item) => item.id !== itemId
        );
      }

      return currentItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );
    });
  };

  const clearOrder = () => {
    setItems([]);
  };

  const getQuantity = (itemId) => {
    const item = items.find(
      (orderItem) => orderItem.id === itemId
    );

    return item ? item.quantity : 0;
  };

  const totalItems = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const numericPrice = Number(
        String(item.price).replace(/[₦,\s]/g, "")
      );

      return total + numericPrice * item.quantity;
    }, 0);
  }, [items]);

  const totalPrepTime = useMemo(() => {
    if (items.length === 0) {
      return 0;
    }

    return Math.max(
      ...items.map((item) =>
        parseInt(String(item.prepTime), 10) || 0
      )
    );
  }, [items]);

  // Cart controls
  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen((current) => !current);
  };

  const value = {
    // Order data
    items,
    totalItems,
    totalPrice,
    totalPrepTime,

    // Order actions
    addToOrder,
    removeFromOrder,
    clearOrder,
    getQuantity,

    // Cart drawer
    isCartOpen,
    openCart,
    closeCart,
    toggleCart,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrder must be used inside an OrderProvider"
    );
  }

  return context;
}