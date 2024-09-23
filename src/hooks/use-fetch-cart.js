import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchCart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triggerFetch, setTriggerFetch] = useState(0); // state to trigger re-fetch

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      setCart(response.data.carts);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart, triggerFetch]); // Dependency array includes triggerFetch

  const refetchCart = () => {
    setTriggerFetch((prev) => prev + 1); // Increment to trigger re-fetch
  };

  return { cart, loading, error, refetchCart };
};

export default useFetchCart;
