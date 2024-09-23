"use client"

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import { useResponsive } from "src/hooks/use-responsive";

import Carousel, {
  useCarousel,
  CarouselDots,
  CarouselArrows,
} from "src/components/carousel";

import EcommerceProductItemHot from "../product/item/ecommerce-product-item-hot";
import { useEffect, useState } from "react";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import { CircularProgress } from "@mui/material";

// ----------------------------------------------------------------------

export default function EcommerceLandingOurProduct() {
  const theme = useTheme();

  const mdUp = useResponsive("up", "md");

  const loading = useBoolean(true);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      loading.onTrue();
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes?length=18`;
        const response = await axios.get(url);

        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      loading.onFalse(); // Deactivate loading indicator
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const carousel = useCarousel({
    dots: !mdUp,
    slidesToShow: 6,
    slidesToScroll: 6,
    ...CarouselDots({
      sx: {
        mt: 8,
      },
    }),
    responsive: [
      {
        // Down md
        breakpoint: theme.breakpoints.values.md,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        // Down sm
        breakpoint: theme.breakpoints.values.sm,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
    ],
  });

  return (
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems="center"
        spacing={3}
        sx={{
          mb: 8,
        }}
      >
        <Typography
          variant="h3"
          sx={{
            textAlign: { xs: "center", md: "unset" },
          }}
        >
          👟 Our Products
        </Typography>

        {mdUp && (
          <CarouselArrows
            onNext={carousel.onNext}
            onPrev={carousel.onPrev}
            flexGrow={1}
            spacing={2}
            justifyContent="flex-end"
          />
        )}
      </Stack>

      {loading.value && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}

      {!loading.value && (
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {products.map((product) => (
            <Box
              key={product._id}
              sx={{
                py: 0.5,
                px: { xs: 1, md: 1.5 },
              }}
            >
              <EcommerceProductItemHot product={product} hotProduct />
            </Box>
          ))}
        </Carousel>
      )}
    </Container>
  );
}
