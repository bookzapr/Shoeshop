"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import useFetchCart from "src/hooks/use-fetch-cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch cart from the server
  const fetchCart = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      // console.log(data.carts);
      setCart(data.carts);
      // setCart(data.carts[0]?.items);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addItemToCart = async ({ shoeId, colorId, size, quantity = 1 }) => {
    const newItem = { shoeId, colorId, size, quantity };

    try {
      // Assume that the server expects the newItem to be wrapped in a particular object structure
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts`,
        newItem,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Check if response is successful and use the updated cart data from the server
      if (response?.data && response?.data?.carts) {
        setCart(response?.data?.carts); // assuming the response will be the whole cart object array
      } else {
        // If no new cart data is returned, update locally (fallback)
        setCart((prevCart) => {
          const existingCart = prevCart[0]; // Assume there's at least one cart object in the array
          let existingItem = existingCart.items.find(
            (item) =>
              item.colorId === newItem.colorId && item.size === newItem.size
          );

          if (existingItem) {
            // If item exists, just update the quantity
            return [
              {
                ...existingCart,
                items: existingCart.items.map((item) =>
                  item.colorId === newItem.colorId && item.size === newItem.size
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
                ),
              },
            ];
          } else {
            // If item does not exist, add the new item
            const updatedItems = [...existingCart.items, newItem];
            return [{ ...existingCart, items: updatedItems }];
          }
        });
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const deleteItemFromCart = async (id, toggleUpdateTrigger) => {
    await onDeleteCart(id, toggleUpdateTrigger);
  };

  // Helper function to update the cart on the server
  const updateCartOnServer = async (updatedCart) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts`,
        updatedCart,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Failed to update cart on the server", error);
    }
  };

  const onDeleteCart = async (id, toggleUpdateTrigger) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      toggleUpdateTrigger();
    } catch (error) {
      console.error("Failed to ... on the server", error);
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addItemToCart, deleteItemFromCart, loading }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
