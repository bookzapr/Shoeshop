"use client";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import Iconify from "src/components/iconify";

import EcommerceCartList from "../cart/ecommerce-cart-list";
import EcommerceCartSummary from "../cart/ecommerce-cart-summary";
import { useEffect, useState } from "react";
import axios from "axios";
import { useBoolean } from "src/hooks/use-boolean";
import { Box, CircularProgress } from "@mui/material";

// ----------------------------------------------------------------------

const shipping = 5;

// ----------------------------------------------------------------------

export default function EcommerceCartView() {
  const [cart, setCart] = useState([]);

  const loading = useBoolean();

  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    const fetchUserCart = async () => {
      loading.onTrue();
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setCart(res.data.carts);
      } catch (error) {
        console.log(error);
      }
      loading.onFalse();
    };

    fetchUserCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTrigger]);
  
  const toggleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
  };

  const itemsWithTotalPrice = cart[0]?.items?.map(
    (item) => item.price * item.quantity
  );

  const overallTotal = itemsWithTotalPrice?.reduce(
    (total, item) => total + item,
    0
  );

  return (
    <Container
      sx={{
        overflow: "hidden",
        pt: 5,
        pb: { xs: 5, md: 10 },
      }}
    >
      <Typography variant="h3" sx={{ mb: 5 }}>
        Shopping Cart
      </Typography>

      {loading.value && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      )}

      {!loading.value && (
        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid xs={12} md={8}>
            <EcommerceCartList products={cart} toggleUpdateTrigger={toggleUpdateTrigger} />
          </Grid>

          <Grid xs={12} md={4}>
            <EcommerceCartSummary
              total={overallTotal + shipping}
              subtotal={overallTotal}
              shipping={shipping}
              discount={0.0}
              cartLength={cart[0]?.items?.length}
            />
          </Grid>
        </Grid>
      )}

      <Button
        component={RouterLink}
        href={paths.eCommerce.products}
        color="inherit"
        startIcon={<Iconify icon="carbon:chevron-left" />}
        sx={{ mt: 3 }}
      >
        Continue Shopping
      </Button>
    </Container>
  );
}
