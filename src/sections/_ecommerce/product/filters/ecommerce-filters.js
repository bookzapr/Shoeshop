import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";

import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import Iconify from "src/components/iconify";

import FilterBrand from "./filter-brand";
import FilterPrice from "./filter-price";
import FilterGender from "./filter-gender";
import FilterSize from "./filter-size";
import ColorPicker from "./filter-color";
import axios from "axios";
import { Box } from "@mui/system";
import { CircularProgress } from "@mui/material";

// ----------------------------------------------------------------------

const GENDER_OPTIONS = ["Male", "Female", "Kids"];

export const COLOR_OPTIONS = [
  { label: "Black", color: "#000000" },
  { label: "Blue", color: "#2563eb" },
  { label: "Brown", color: "#92400e" },
  { label: "Green", color: "#16a34a" },
  { label: "Grey", color: "#6b7280" },
  { label: "Orange", color: "#f97316" },
  { label: "Pink", color: "#fb7185" },
  { label: "Purple", color: "#9333ea" },
  { label: "Red", color: "#dc2626" },
  { label: "White", color: "#ffffff" },
  { label: "Yellow", color: "#facc15" },
  { label: "Cyan", color: "#06b6d4" },
];

const SIZE_OPTIONS = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
  12, 12.5, 13, 13.5, 14, 15,
];

// ----------------------------------------------------------------------

const defaultValues = {
  filterGender: [],
  filterBrand: [],
  filterSize: [],
  filterColor: [],
  filterPrice: {
    start: 0,
    end: 200,
  },
};

export default function EcommerceFilters({
  open,
  onClose,
  onUpdateFilters,
  paramBrand,
}) {
  const mdUp = useResponsive("up", "md");

  const [filters, setFilters] = useState(defaultValues);

  const [BRAND_OPTIONS, setBrands] = useState([]);

  const loading = useBoolean(true);

  useEffect(() => {
    const newFilters = {
      ...filters,
      filterBrand: getSelected(filters.filterBrand, paramBrand),
    };
    setFilters(newFilters);

    const fetchBrands = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/brands`
        );
        const brandNames = response.data.data.map((item) => item.brand);
        setBrands(brandNames); // Assuming response.data contains the list of brands
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
      loading.onFalse();
    };

    fetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSelected = useCallback((selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item]
  );

  const handleChangeGender = useCallback(
    (gender) => {
      const newFilters = {
        ...filters,
        filterGender: getSelected(filters.filterGender, gender),
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters);
    },
    [filters, getSelected, onUpdateFilters]
  );

  const handleChangeBrand = useCallback(
    (name) => {
      const newFilters = {
        ...filters,
        filterBrand: getSelected(filters.filterBrand, name),
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters);
    },
    [filters, getSelected, onUpdateFilters]
  );

  const handleChangeStartPrice = useCallback(
    (event) => {
      const newStartPrice = Number(event.target.value);
      const newFilters = {
        ...filters,
        filterPrice: {
          ...filters.filterPrice,
          start: newStartPrice,
        },
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters);
    },
    [filters, onUpdateFilters]
  );

  const handleChangeEndPrice = useCallback(
    (event) => {
      const newEndPrice = Number(event.target.value);
      const newFilters = {
        ...filters,
        filterPrice: {
          ...filters.filterPrice,
          end: newEndPrice,
        },
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters);
    },
    [filters, onUpdateFilters]
  );

  const handleChangeSize = useCallback(
    (size) => {
      const newSizeFilter = getSelected(filters.filterSize, size);
      const newFilters = {
        ...filters,
        filterSize: newSizeFilter,
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters); // Propagate changes to the parent component
    },
    [filters, getSelected, onUpdateFilters]
  );

  const handleChangeColor = useCallback(
    (option) => {
      const newColorFilter = filters.filterColor.includes(option.label)
        ? []
        : [option.label]; // Toggle selection
      const newFilters = {
        ...filters,
        filterColor: newColorFilter,
      };
      setFilters(newFilters);
      onUpdateFilters(newFilters);
    },
    [filters, onUpdateFilters]
  );

  const handleClearAll = useCallback(() => {
    setFilters(defaultValues);
    onUpdateFilters(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onUpdateFilters]);

  const renderContent = (
    <Stack
      spacing={3}
      alignItems="flex-start"
      sx={{
        flexShrink: 0,
        width: { xs: 1, md: 280 },
      }}
    >
      <Block title="Gender">
        <FilterGender
          filterGender={filters.filterGender}
          onChangeGender={handleChangeGender}
          options={GENDER_OPTIONS}
          sx={{ mt: 1 }}
        />
      </Block>

      <Block title="Brand">
        {loading.value && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 1 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading.value && (
          <FilterBrand
            filterBrand={filters.filterBrand}
            onChangeBrand={handleChangeBrand}
            options={BRAND_OPTIONS}
            sx={{ mt: 1 }}
          />
        )}
      </Block>

      <Block title="Size">
        <FilterSize
          selectedSizes={filters.filterSize}
          onChangeSize={handleChangeSize}
          sizes={SIZE_OPTIONS}
          sx={{ mt: 1 }}
        />
      </Block>

      <Block title="Color">
        <ColorPicker
          colorOptions={COLOR_OPTIONS}
          selected={filters.filterColor}
          onSelectColor={handleChangeColor}
          sx={{ mt: 1 }}
        />
      </Block>

      <Block title="Price">
        <FilterPrice
          filterPrice={filters.filterPrice}
          onChangeStartPrice={handleChangeStartPrice}
          onChangeEndPrice={handleChangeEndPrice}
          sx={{ mt: 2 }}
        />
      </Block>

      {/* <Block title="Ratings">
        <FilterRating
          filterRating={filters.filterRating}
          onChangeRating={handleChangeRating}
          sx={{ mt: 2 }}
        />
      </Block> */}

      <Button
        fullWidth
        color="inherit"
        size="large"
        variant="contained"
        startIcon={<Iconify icon="carbon:trash-can" />}
        onClick={handleClearAll}
      >
        Clear All
      </Button>
    </Stack>
  );

  return (
    <>
      {mdUp ? (
        renderContent
      ) : (
        <Drawer
          anchor="right"
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
              pt: 3,
              px: 3,
              width: 280,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </>
  );
}

EcommerceFilters.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

// ----------------------------------------------------------------------

function Block({ title, children, isOpen, ...other }) {
  const contentOpen = useBoolean(true);

  return (
    <Stack alignItems="flex-start" sx={{ width: 1 }} {...other}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={contentOpen.onToggle}
        sx={{ width: 1, cursor: "pointer" }}
      >
        <Typography variant="h6">{title}</Typography>

        <Iconify
          icon={contentOpen.value ? "carbon:subtract" : "carbon:add"}
          sx={{ color: "text.secondary" }}
        />
      </Stack>

      <Collapse unmountOnExit in={contentOpen.value} sx={{ px: 0.5 }}>
        {children}
      </Collapse>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  isOpen: PropTypes.bool,
};
