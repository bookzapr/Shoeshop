import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import TextMaxLine from "src/components/text-max-line";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button, CircularProgress } from "@mui/material";
import { useBoolean } from "src/hooks/use-boolean";

// ----------------------------------------------------------------------

export default function EcommerceLandingBrands() {
  const [brands, setBrands] = useState([]);

  const loading = useBoolean(true);

  useEffect(() => {
    const fetchBrands = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/brands`
        );
        const brandNames = response.data.data.map((item) => item.brand);
        setBrands(brandNames);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
      loading.onFalse();
    };

    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container
      sx={{
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          mb: 8,
          textAlign: { xs: "center", md: "unset" },
        }}
      >
        Brands
      </Typography>

      {loading.value && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      )}

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(4, 1fr)",
          md: "repeat(6, 1fr)",
        }}
      >
        {brands.map((brand) => (
          <Button
            key={brand}
            alignItems="center"
            justifyContent="center"
            href={`/products?brand=${brand}`}
            sx={{
              px: 1,
              py: 3,
              borderRadius: 2,
              cursor: "pointer",
              border: (theme) =>
                `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
              "&:hover": {
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
              },
            }}
          >
            <TextMaxLine variant="subtitle2" line={1}>
              {brand}
            </TextMaxLine>
          </Button>
        ))}
      </Box>
    </Container>
  );
}
