import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2";
import { alpha, useTheme } from "@mui/material/styles";

import { RouterLink } from "src/routes/components";

import Image from "src/components/image";
import Label from "src/components/label";
import Iconify from "src/components/iconify";
import TextMaxLine from "src/components/text-max-line";

// ----------------------------------------------------------------------

export default function EcommerceProductItemHero({ product }) {
  const theme = useTheme();

  const productName = `${product.brand} ${product.model}`;

  const truncateText = (text) => {
    if (text.length > 25) {
      return `${text.substring(0, 30 - 3)}...`;
    }
    return text;
  };

  return (
    <Grid
      container
      rowSpacing={{
        xs: 5,
        md: 0,
      }}
      sx={{
        py: 10,
        px: { xs: 3, md: 10 },
      }}
    >
      <Grid xs={12} md={6}>
        <Box
          sx={{
            maxWidth: { md: 440 },
            textAlign: { xs: "center", md: "unset" },
          }}
        >
          <Label color="success" sx={{ mb: 2 }}>
            Shop Now
          </Label>

          <TextMaxLine variant="h3" sx={{ mb: 2 }}>
            {truncateText(productName)}
          </TextMaxLine>

          <TextMaxLine variant="body2" sx={{ mb: 5, color: "text.secondary" }}>
            {product.description || "No description"}
          </TextMaxLine>

          <Button
            component={RouterLink}
            href={`/product/${product._id}`}
            size="large"
            color="inherit"
            variant="contained"
            endIcon={<Iconify icon="carbon:chevron-right" />}
          >
            Shop Now
          </Button>
        </Box>
      </Grid>

      <Grid xs={12} md={6}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${product?.colors[0]?._id}`}
          sx={{
            filter: `drop-shadow(20px 20px 24px ${alpha(theme.palette.common.black, 0.16)})`,
            maxWidth: 400,
            ml: "auto",
            mr: { xs: "auto", md: "unset" },
          }}
          ratio="1/1"
          alt="cover"
        />
      </Grid>
    </Grid>
  );
}

EcommerceProductItemHero.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    brand: PropTypes.string,
    model: PropTypes.string,
    description: PropTypes.string,
  }),
};
