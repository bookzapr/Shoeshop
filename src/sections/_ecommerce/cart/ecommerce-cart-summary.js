import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useBoolean } from "src/hooks/use-boolean";
import { LoadingButton } from "@mui/lab";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

export default function EcommerceCartSummary({
  total,
  subtotal,
  shipping,
  discount,
  cartLength,
}) {
  const loading = useBoolean();
  const [orderId, setOrderId] = useState("");

  const router = useRouter();

  const handleCheckout = async () => {
    loading.onTrue();
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/carts/checkout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("cart -> order", res.data);
    } catch (error) {
      console.log(error);
    }

    try {
      const resp = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders?status=pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log("get pending order", resp.data.orders);
      setOrderId(resp.data.orders[0]?._id);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/${resp.data.orders[0]?._id}/checkout`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("get redirect", res.data);
        router.push(res.data.redirectUrl);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }

    loading.onFalse();
  };

  return (
    <Stack
      spacing={3}
      sx={{
        p: 5,
        borderRadius: 2,
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
      }}
    >
      <Typography variant="h6"> Summary </Typography>

      <Stack spacing={2}>
        <Row label="Subtotal" value={`฿${subtotal}`} />

        <Row label="Shipping" value={`฿${cartLength == 0 ? "0" : shipping}`} />

        <Row label="Tax (Included.)" value={"7%"} />
      </Stack>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Row
        label="Total"
        value={`฿${cartLength == 0 ? "0" : total}`}
        sx={{
          typography: "h6",
          "& span": { typography: "h6" },
        }}
      />

      <LoadingButton
        onClick={handleCheckout}
        size="large"
        variant="contained"
        color="inherit"
        loading={loading.value}
        disabled={cartLength == 0}
      >
        Checkout
      </LoadingButton>
    </Stack>
  );
}

EcommerceCartSummary.propTypes = {
  total: PropTypes.number,
  discount: PropTypes.number,
  shipping: PropTypes.number,
  subtotal: PropTypes.number,
};

// ----------------------------------------------------------------------

function Row({ label, value, sx, ...other }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ typography: "subtitle2", ...sx }}
      {...other}
    >
      <Box component="span" sx={{ typography: "body2" }}>
        {label}
      </Box>
      {value}
    </Stack>
  );
}

Row.propTypes = {
  sx: PropTypes.object,
  label: PropTypes.string,
  value: PropTypes.string,
};
