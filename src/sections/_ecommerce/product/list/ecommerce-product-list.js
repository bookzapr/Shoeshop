import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Pagination, { paginationClasses } from "@mui/material/Pagination";

import EcommerceProductViewListItem from "../item/ecommerce-product-view-list-item";
import EcommerceProductViewGridItem from "../item/ecommerce-product-view-grid-item";
import EcommerceProductViewListItemSkeleton from "../item/ecommerce-product-view-list-item-skeleton";
import EcommerceProductViewGridItemSkeleton from "../item/ecommerce-product-view-grid-item-skeleton";

// ----------------------------------------------------------------------

export default function EcommerceProductList({ loading, viewMode, products, currentPage, onPageChange, totalPages }) {
  return (
    <>
      {viewMode === "grid" ? (
        <Box
          rowGap={4}
          columnGap={3}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(2, 1fr)",
            sm: "repeat(3, 1fr)",
            md: "repeat(4, 1fr)",
          }}
        >
          {(loading ? [...Array(products.length)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewGridItem
                key={product._id}
                product={product}
              />
            ) : (
              <EcommerceProductViewGridItemSkeleton key={index} />
            )
          )}
        </Box>
      ) : (
        <Stack spacing={4}>
          {(loading ? [...Array(products.length)] : products).map((product, index) =>
            product ? (
              <EcommerceProductViewListItem
                key={product._id}
                product={product}
              />
            ) : (
              <EcommerceProductViewListItemSkeleton key={index} />
            )
          )}
        </Stack>
      )}

      <Pagination
        count={totalPages} // This should be dynamic based on total pages available
        page={currentPage}
        onChange={onPageChange} // Handle page change
        color="primary"
        sx={{
          mt: 10,
          mb: 5,
          [`& .${paginationClasses.ul}`]: {
            justifyContent: "center",
          },
        }}
      />
    </>
  );
}

EcommerceProductList.propTypes = {
  loading: PropTypes.bool,
  products: PropTypes.array,
  viewMode: PropTypes.string,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
};
