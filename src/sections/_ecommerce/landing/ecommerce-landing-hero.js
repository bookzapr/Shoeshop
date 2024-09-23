import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { alpha, useTheme } from "@mui/material/styles";

import { bgGradient } from "src/theme/css";

import Carousel, { useCarousel, CarouselDots } from "src/components/carousel";

import EcommerceProductItemHero from "../product/item/ecommerce-product-item-hero";
import { useBoolean } from "src/hooks/use-boolean";
import { useEffect, useState } from "react";
import axios from "axios";

// ----------------------------------------------------------------------

export default function EcommerceLandingHero() {
  const theme = useTheme();

  const loading = useBoolean(true);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      loading.onTrue();
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes?length=4`;
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
    fade: true,
    speed: 100,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    ...CarouselDots({
      rounded: true,
      sx: {
        left: 0,
        right: 0,
        zIndex: 9,
        bottom: 40,
        mx: "auto",
        position: "absolute",
      },
    }),
  });

  return (
    <Container
      sx={{
        pt: { xs: 5, md: 8 },
      }}
    >
      <Box
        sx={{
          ...bgGradient({
            color: alpha(theme.palette.background.default, 0.9),
            imgUrl: "/assets/background/overlay_1.jpg",
          }),
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
          {products.map((product) => (
            <EcommerceProductItemHero key={product._id} product={product} />
          ))}
        </Carousel>
      </Box>
    </Container>
  );
}
