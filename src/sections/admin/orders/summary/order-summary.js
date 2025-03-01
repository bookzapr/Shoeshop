"use client";

import {
  Grid,
  Typography,
  Container,
  Stack,
  Card,
  Box,
  alpha,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Label from "src/components/label";
import Scrollbar from "src/components/scrollbar";
import { useBoolean } from "src/hooks/use-boolean";
import { fDateTime } from "src/utils/format-time";
import ItemList from "./item-list";

// ----------------------------------------------------------------------

const shipping = 15;

export default function OrderSummary({ params }) {
  const loading = useBoolean(true);
  const [order, setOrder] = useState({});

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/${params.oid}`
        );
        setOrder(response.data.order.order);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
      loading.onFalse();
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateTotalPrice = (order) => {
    let total = 0;
    order.items.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  console.log(order);

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Order Summary</Typography>
        </Stack>

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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* User Details */}
              <Card sx={{ mb: 2 }}>
                <Stack spacing={2} sx={{ p: 3 }}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold" }}
                  >{`Order #${params.oid}`}</Typography>
                  <Typography variant="body2">{`${fDateTime(order.createdAt)}`}</Typography>
                  <Label color="success" sx={{ width: "fit-content" }}>
                    {order.status}
                  </Label>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <Typography variant="body2">{`User Id: ${order.user}`}</Typography>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <Typography variant="body2">{`Street Address: ${order.address.line1} ${order.address.line2}`}</Typography>
                  <Typography variant="body2">{`Suburb: ${order.address.city}`}</Typography>
                  <Typography variant="body2">{`Postal Code : ${order.address.postal_code}`}</Typography>
                  <Typography variant="body2">{`Country: ${order.address.country}`}</Typography>
                  <Divider sx={{ borderStyle: "dashed" }} />
                  <Scrollbar>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        py: 2,
                        minWidth: 720,
                        typography: "subtitle2",
                        borderBottom: (theme) =>
                          `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <Stack flexGrow={1}>Item</Stack>
                      <Stack sx={{ width: 120 }}>Qty</Stack>
                      <Stack sx={{ width: 120 }}>Subtotal</Stack>
                      <Stack sx={{ width: 36 }} />
                    </Stack>

                    {order.items.map((product) => (
                      <ItemList
                        key={product._id}
                        product={product}
                        setTotalPrice={setTotalPrice}
                        totalPrice={totalPrice}
                      />
                    ))}
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      <Row
                        label="Subtotal"
                        value={calculateTotalPrice(order)}
                        currency={"฿"}
                      />

                      <Row label="Shipping" value={shipping} currency={"฿"} />

                      {/* <Row label="Discount" value={`-0`} /> */}

                      <Row label="Tax (Included)" value={"7%"} currency={""} />

                      <Divider sx={{ borderStyle: "dashed" }} />

                      <Row
                        label="Total"
                        value={calculateTotalPrice(order) + shipping}
                        sx={{ typography: "subtitle1" }}
                        currency={"฿"}
                      />
                    </Stack>
                  </Scrollbar>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}

function Row({ label, value, sx, currency, ...other }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ typography: "subtitle2", ...sx }}
      {...other}
    >
      <Box component="span" sx={{ typography: "body2", ...sx }}>
        {label}
      </Box>
      {currency}
      {value}
    </Stack>
  );
}
