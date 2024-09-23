import PropTypes from "prop-types";
import { useState, useCallback, useContext } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import { useResponsive } from "src/hooks/use-responsive";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

import ProductPrice from "../../common/product-price";
import { Alert, Grid, Link } from "@mui/material";
import CartContext from "src/context/CartContext";
import Counter from "src/components/counter";
import ProductColorPicker from "../../common/product-color-picker";

// ----------------------------------------------------------------------

export default function EcommerceProductDetailsInfo({
  id,
  name,
  price,
  priceSale,
  caption,
  items,
  colors,
  totalQty,
}) {
  const mdUp = useResponsive("up", "md");

  const { addItemToCart } = useContext(CartContext);

  const [selectedSize, setSelectedSize] = useState(null);

  const [count, setCount] = useState(0);

  const [maxQty, setMaxQty] = useState(0);

  const [isEdit, setIsEdit] = useState(false);

  const [color, setColor] = useState("");

  const [sizes, setSizes] = useState([]);

  const [colorId, setColorId] = useState("");

  const [addToCart, setAddToCart] = useState(false);

  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  const handleChangeColor = useCallback(
    (event) => {
      const selectedColor = event.target.value;
      setColor(selectedColor);

      // Find the item that matches the selected color
      const selectedItem = items.find((item) => item.name === selectedColor);

      if (selectedItem) {
        // If the item is found, update the sizes state with the sizes of the selected item
        setSizes(selectedItem.sizes);
        setColorId(selectedItem._id);
        // Reset other state values
        setSelectedSize(null);
        setIsEdit(false);
        setCount(0);
        setMaxQty(0);
      }
    },
    [items]
  );

  const handleSelectSize = useCallback(
    (size) => {
      setSelectedSize((prevSelectedSize) => {
        if (prevSelectedSize && prevSelectedSize._id === size._id) {
          setIsEdit(false);
          setMaxQty(0);
          setCount(0);
          return null;
        } else {
          if (token) {
            setIsEdit(true);
          }
          setCount(1);
          setMaxQty(size.quantity);
          return size;
        }
      });
    },
    [token]
  );

  const addToCartHandler = async () => {
    const rawToken = localStorage.getItem("accessToken");
    if (rawToken) {
      addItemToCart({
        shoeId: id,
        colorId: colorId,
        size: selectedSize.size,
        quantity: count,
      });
      setCount(1);
      setAddToCart(true);
      setTimeout(() => {
        setAddToCart(false);
      }, 3000);
    } else {
      console.log("Unauthorization");
    }
  };

  return (
    <>
      {totalQty != 0 ? (
        <Label color="success" sx={{ mb: 3 }}>
          In Stock
        </Label>
      ) : (
        <Label color="error" sx={{ mb: 3 }}>
          Out of Stock
        </Label>
      )}

      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h4">{name}</Typography>
      </Stack>

      <Stack spacing={2}>
        <ProductPrice
          price={price}
          priceSale={priceSale}
          sx={{ typography: "h5" }}
        />

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {caption ? caption : "No description"}
        </Typography>
      </Stack>

      <Divider sx={{ borderStyle: "dashed", my: 3 }} />

      <Stack spacing={3} sx={{ my: 3 }}>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Color</Typography>
          <ProductColorPicker
            value={color}
            onChange={handleChangeColor}
            options={colors}
          />
        </Stack>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2">Size</Typography>
            {/* <Typography variant="subtitle2">
              <Link href="#" underline="always">
                Size Chart
              </Link>
            </Typography> */}
          </Stack>
          <Stack>
            {sizes.length == 0 && (
              <Typography variant="subtitle2" color="error">
                Please select color first
              </Typography>
            )}
            {/* Shoe size here */}
            <Grid container spacing={2}>
              {sizes?.map(
                (size, index) =>
                  size.quantity != 0 && (
                    <Grid item xs={3} key={size.size}>
                      <Button
                        variant={
                          selectedSize?.size === size.size
                            ? "contained"
                            : "outlined"
                        }
                        color={
                          selectedSize?.size === size.size
                            ? "primary"
                            : "inherit"
                        }
                        onClick={() => handleSelectSize(size)}
                        fullWidth
                      >
                        <Stack direction={"column"}>
                          <Stack>{size.size}</Stack>
                          <Typography variant="subtitle2">
                            Qty: {size.quantity}
                          </Typography>
                        </Stack>
                      </Button>
                    </Grid>
                  )
              )}
            </Grid>
          </Stack>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: "dashed", my: 3 }} />

      {!token && (
        <Alert severity="error" sx={{ width: "100%", my: 3 }}>
          Please <Link href="/auth/login">login</Link> first
        </Alert>
      )}

      <Stack
        spacing={2}
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
      >
        <Counter
          count={count}
          setCount={setCount}
          maxCount={maxQty}
          isCart={false}
          isEdit={isEdit}
        />

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth={!mdUp}
            size="large"
            color={addToCart ? "success" : "inherit"}
            variant="contained"
            startIcon={
              addToCart ? (
                <Iconify icon="carbon:checkmark-outline" />
              ) : (
                <Iconify icon="carbon:shopping-cart-plus" />
              )
            }
            onClick={addToCartHandler}
            disabled={!isEdit}
          >
            {addToCart ? "Added" : "Add to Cart"}
          </Button>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: "dashed", my: 3 }} />
    </>
  );
}

EcommerceProductDetailsInfo.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  price: PropTypes.number,
  image: PropTypes.string,
  ratingNumber: PropTypes.number,
  totalReviews: PropTypes.number,
  priceSale: PropTypes.number,
  caption: PropTypes.string,
  sizes: PropTypes.array,
  colors: PropTypes.array,
  totalQty: PropTypes.number,
};