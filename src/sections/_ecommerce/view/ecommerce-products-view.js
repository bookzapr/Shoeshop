"use client";

import { useState, useEffect, useCallback } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";

import EcommerceFilters from "../product/filters/ecommerce-filters";
import EcommerceProductList from "../product/list/ecommerce-product-list";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// ----------------------------------------------------------------------

const VIEW_OPTIONS = [
  { value: "list", icon: <Iconify icon="carbon:list-boxes" /> },
  { value: "grid", icon: <Iconify icon="carbon:grid" /> },
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Popular" },
];

// ----------------------------------------------------------------------

export default function EcommerceProductsView() {
  const mobileOpen = useBoolean();

  // const [sort, setSort] = useState("latest");

  const loading = useBoolean(true);

  const [viewMode, setViewMode] = useState("grid");

  const [products, setProducts] = useState([]);

  const searchParams = useSearchParams();

  const [brand, setBrand] = useState(searchParams.get("brand") || "");

  const [filters, setFilters] = useState({
    brands: [brand],
    genders: [],
    sizes: [],
    colors: [],
    priceRange: {
      start: 0,
      end: 200,
    },
  });

  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      loading.onTrue();
      try {
        const brandQuery = filters.brands
          .map((brand) => `&brand=${encodeURIComponent(brand)}`)
          .join("");
        const genderQuery = filters.genders
          .map((gender) => `&gender=${encodeURIComponent(gender)}`)
          .join("");
        const priceQuery = `&minPrice=${encodeURIComponent(filters.priceRange.start)}&maxPrice=${encodeURIComponent(filters.priceRange.end)}`;
        const sizeQuery = `&size=${filters.sizes.join(",")}`;
        const colorQuery = filters.colors
          .map((color) => `&color=${encodeURIComponent(color)}`)
          .join("");

        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes?page=${currentPage}${brandQuery}${genderQuery}${priceQuery}${sizeQuery}${colorQuery}`;
        const response = await axios.get(url);

        setProducts(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      loading.onFalse();
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleChangeViewMode = useCallback((event, newAlignment) => {
    if (newAlignment !== null) {
      setViewMode(newAlignment);
    }
  }, []);

  // const handleChangeSort = useCallback((event) => {
  //   setSort(event.target.value);
  // }, []);

  const handleUpdateFilters = useCallback((newFilters) => {
    setFilters({
      brands: newFilters.filterBrand,
      genders: newFilters.filterGender,
      priceRange: newFilters.filterPrice,
      sizes: newFilters.filterSize,
      colors: newFilters.filterColor,
    });
  }, []);

  return (
    <Suspense fallback={null}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            py: 5,
          }}
        >
          <Typography variant="h3">Products</Typography>

          {/* Display on mobile */}
          <Button
            color="inherit"
            variant="contained"
            startIcon={<Iconify icon="carbon:filter" width={18} />}
            onClick={mobileOpen.onTrue}
            sx={{
              display: { md: "none" },
            }}
          >
            Filters
          </Button>
        </Stack>

        <Stack
          direction={{
            xs: "column-reverse",
            md: "row",
          }}
          sx={{ mb: { xs: 8, md: 10 } }}
        >
          <Stack
            spacing={5}
            divider={<Divider sx={{ borderStyle: "dashed" }} />}
          >
            <EcommerceFilters
              open={mobileOpen.value}
              onClose={mobileOpen.onFalse}
              onUpdateFilters={handleUpdateFilters}
              paramBrand={brand}
            />
          </Stack>

          <Box
            sx={{
              flexGrow: 1,
              pl: { md: 8 },
              width: { md: `calc(100% - ${280}px)` },
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 5 }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={viewMode}
                onChange={handleChangeViewMode}
                sx={{ borderColor: "transparent" }}
              >
                {VIEW_OPTIONS.map((option) => (
                  <ToggleButton key={option.value} value={option.value}>
                    {option.icon}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              {/* <FormControl size="small" hiddenLabel sx={{ width: 120 }}>
                <Select value={sort} onChange={handleChangeSort}>
                  {SORT_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl> */}
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
              <EcommerceProductList
                loading={loading.value}
                viewMode={viewMode}
                products={products}
                currentPage={currentPage}
                onPageChange={(event, value) => setCurrentPage(value)}
                totalPages={totalPages}
              />
            )}
          </Box>
        </Stack>
      </Container>
    </Suspense>
  );
}
