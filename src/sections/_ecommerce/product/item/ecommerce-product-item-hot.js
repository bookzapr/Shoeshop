import PropTypes from "prop-types";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";

import { RouterLink } from "src/routes/components";

import Image from "src/components/image";
import TextMaxLine from "src/components/text-max-line";

import ProductPrice from "../../common/product-price";

// ----------------------------------------------------------------------

export default function EcommerceProductItemHot({
  product,
  hotProduct = false,
  sx,
}) {
  return (
    <Link
      component={RouterLink}
      href={`/product/${product._id}`}
      color="inherit"
      underline="none"
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: "background.default",
          transition: (theme) =>
            theme.transitions.create("background-color", {
              easing: theme.transitions.easing.easeIn,
              duration: theme.transitions.duration.shortest,
            }),
          "&:hover": {
            bgcolor: "background.neutral",
          },
          ...sx,
        }}
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${product.colors[0]._id}`}
          sx={{
            mb: 2,
            borderRadius: 1.5,
            bgcolor: "background.neutral",
          }}
          ratio="1/1"
          alt="product"
        />

        <Stack spacing={0.5}>
          <TextMaxLine
            variant="body2"
            line={1}
            sx={{ fontWeight: "fontWeightMedium" }}
          >
            {product.brand} {product.model}
          </TextMaxLine>

          <ProductPrice
            price={product.price}
            sx={{
              ...(hotProduct && {
                color: "error.main",
              }),
            }}
          />
        </Stack>
      </Paper>
    </Link>
  );
}

EcommerceProductItemHot.propTypes = {
  hotProduct: PropTypes.bool,
  product: PropTypes.shape({
    _id: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    price: PropTypes.number,
    colors: PropTypes.array,
  }),
  sx: PropTypes.object,
};
