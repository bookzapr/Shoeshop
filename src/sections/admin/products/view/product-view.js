"use client";

import { useEffect, useState } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

import TableNoData from "../table-no-data";
import ProductTableRow from "../product-table-row";
import ProductTableHead from "../product-table-head";
import TableEmptyRows from "../table-empty-rows";
import ProductTableToolbar from "../product-table-toolbar";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { Box, CircularProgress } from "@mui/material";

// ----------------------------------------------------------------------

export default function ProductPage() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const loading = useBoolean(true);

  const [products, setProducts] = useState([]);

  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      loading.onTrue();
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes?length=999`;
        const response = await axios.get(url);

        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
      loading.onFalse(); // Deactivate loading indicator
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateTrigger]);

  const toggleUpdateTrigger = () => {
    setUpdateTrigger(prev => !prev);
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Products</Typography>

        <Button
          variant="contained"
          color="inherit"
          href={"/admin/products/create"}
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          New Product
        </Button>
      </Stack>

      {loading.value && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      )}

      {!loading.value && (
        <Card>
          <ProductTableToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer sx={{ overflow: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <ProductTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleSort}
                  headLabel={[
                    { id: "model", label: "Model" },
                    { id: "brand", label: "Brand" },
                    { id: "gender", label: "Gender" },
                    { id: "price", label: "Price" },
                    { id: "total_quantity", label: "Quantity" },
                    { id: "" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ProductTableRow
                        key={row._id}
                        id={row._id}
                        model={row.model}
                        brand={row.brand}
                        gender={row.gender}
                        price={row.price} 
                        quantity={row.total_quantity}
                        avatarUrl={`${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${row?.colors[0]?._id}`}
                        onDeleted={toggleUpdateTrigger}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, products.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      )}
    </Container>
  );
}
