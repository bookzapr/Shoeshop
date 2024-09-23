import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { fCurrency } from "src/utils/format-number";

import Image from "src/components/image";

// ----------------------------------------------------------------------

export default function ItemList({ product }) {
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

      <Stack sx={{ width: 120 }}>{product.quantity}</Stack>

      <Stack sx={{ width: 120, mr: 4, typography: "subtitle2" }}>
        ฿{product.price * product.quantity}{" "}
      </Stack>
    </Stack>
  );
}
