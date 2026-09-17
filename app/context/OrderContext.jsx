"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const OrderContext = createContext(null);

const STORAGE_KEY = "lynns-kitchen-order";

export function OrderProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved cart ONCE when the app starts
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(STORAGE_KEY);

      if (savedOrder) {
        const parsedOrder = JSON.parse(savedOrder);

        if (Array.isArray(parsedOrder)) {
          setItems(parsedOrder);
        }
      }
    } catch (error) {
      console.error("Failed to load saved order:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart only AFTER the initial load has completed
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Failed to save order:", error);
    }
  }, [items, isHydrated]);

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
      ...items.map(
        (item) =>
          parseInt(String(item.prepTime), 10) || 0
      )
    );
  }, [items]);

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
    items,
    totalItems,
    totalPrice,
    totalPrepTime,

    addToOrder,
    removeFromOrder,
    clearOrder,
    getQuantity,

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