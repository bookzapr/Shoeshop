import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import Image from "src/components/image";
import Iconify from "src/components/iconify";
import Counter from "src/components/counter";
import { useContext, useEffect, useState } from "react";
import CartContext from "src/context/CartContext";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";

// ----------------------------------------------------------------------

export default function EcommerceCartItem({
  product,
  wishlist,
  toggleUpdateTrigger,
}) {
  const { addItemToCart, deleteItemFromCart } = useContext(CartContext);
  const [count, setCount] = useState(product?.quantity);
  const [maxQty, setMaxQty] = useState(0);

  const loading = useBoolean();

  useEffect(() => {
    const fetchColor = async () => {
      loading.onTrue();
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${product.shoeId}/colors/${product.colorId}`
        );
        const item = res.data.data.sizes.find(
          (item) => item.size === product.size
        );
        setMaxQty(item.quantity);
      } catch (error) {
        console.log(error);
      }
      loading.onFalse();
    };

    fetchColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.colorId, product.shoeId, product.size]);

  const updateQuantity = async (qty) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/${product._id}`,
        {
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const increaseQty = async () => {
    const newQty = count + 1;
    await updateQuantity(newQty);
    toggleUpdateTrigger();
  };

  const decreaseQty = async () => {
    const newQty = count - 1;
    await updateQuantity(newQty);
    toggleUpdateTrigger();
  };

  const onDelete = () => {
    deleteItemFromCart(product?._id, toggleUpdateTrigger);
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        py: 3,
        minWidth: 720,
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
      }}
    >
      <Stack direction="row" alignItems="center" flexGrow={1}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${product.colorId}`}
          sx={{
            width: 80,
            height: 80,
            flexShrink: 0,
            borderRadius: 1.5,
            bgcolor: "background.neutral",
          }}
          alt="cover"
        />

        <Stack spacing={0.5} sx={{ p: 2 }}>
          <Typography variant="subtitle2">{product.shoeModel}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Size: {product.size}, Color: {product.color}
          </Typography>
        </Stack>
      </Stack>

      <Stack sx={{ width: 150, mr: 4 }}>
        <Counter
          count={count}
          setCount={setCount}
          maxCount={maxQty}
          increaseQuantity={() => increaseQty()}
          decreaseQuantity={() => decreaseQty()}
          isCart={true}
          isEdit={true}
        />
      </Stack>

      <Stack sx={{ width: 120, typography: "subtitle2" }}>
        ฿{product.price * product.quantity}{" "}
      </Stack>

      <IconButton onClick={onDelete}>
        <Iconify icon="carbon:trash-can" />
      </IconButton>

      {wishlist && (
        <IconButton>
          <Iconify icon="carbon:shopping-cart-plus" />
        </IconButton>
      )}
    </Stack>
  );
}

EcommerceCartItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    quantity: PropTypes.number,
    shoeId: PropTypes.string,
    colorId: PropTypes.string,
    shoeModel: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    price: PropTypes.number,
  }),
  wishlist: PropTypes.bool,
};
