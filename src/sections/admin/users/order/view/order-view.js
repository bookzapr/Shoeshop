"use client";

import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import Scrollbar from "src/components/scrollbar";

import { getComparator, applyFilter } from "../utils";
import EcommerceAccountOrdersTableRow from "../ecommerce-account-orders-table-row";
import EcommerceAccountOrdersTableHead from "../ecommerce-account-orders-table-head";
import EcommerceAccountOrdersTableToolbar from "../ecommerce-account-orders-table-toolbar";
import OrderTableToolbar from "../order-table-toolbar";
import { CircularProgress, Container } from "@mui/material";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import TableNoData from "../../table-no-data";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export const TABLE_HEAD = [
  { id: "_id", label: "Order ID" },
  { id: "item", label: "Item" },
  { id: "createdAt", label: "Purchased date", width: 180 },
  { id: "price", label: "Price", width: 80 },
  { id: "status", label: "Status", width: 100 },
  { id: "" },
];

// ----------------------------------------------------------------------

export default function OrdersPage({ params }) {
  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("_id");

  const [selected, setSelected] = useState([]);

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterOrder, setFilterOrder] = useState("");

  const loading = useBoolean(true);
  const [userOrder, setUserOrder] = useState([]);

  useEffect(() => {
    const fetchUserOrder = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/users/${params.uid}?status=all`
        );
        setUserOrder(response.data.orders);
      } catch (error) {
        console.error("Failed to get user orders:", error);
        toast.error("Failed to get user orders");
      }
      loading.onFalse();
    };

    fetchUserOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === "asc";
      if (id !== "") {
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const handleSelectAllRows = useCallback(
    (event) => {
      if (event.target.checked) {
        const newSelected = userOrder.map((n) => n._id);
        setSelected(newSelected);
        return;
      }
      setSelected([]);
    },
    [userOrder]
  );

  const handleSelectRow = useCallback(
    (id) => {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    },
    [selected]
  );

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userOrder.length) : 0;

  const handleFilterByOrder = (event) => {
    setPage(0);
    setFilterOrder(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: userOrder,
    comparator: getComparator(order, orderBy),
    filterOrder,
  });

  const notFound = !dataFiltered.length && !!filterOrder;

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Orders</Typography>
          <Typography variant="body1">UserId: {params.uid}</Typography>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mt: 5, mb: 3 }}
        >
          <OrderTableToolbar
            filterOrder={filterOrder}
            onFilterOrder={handleFilterByOrder}
          />
        </Stack>

        {loading.value && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        )}
        
        {!loading.value && (
          <TableContainer
            sx={{
              overflow: "unset",
              [`& .${tableCellClasses.head}`]: {
                color: "text.primary",
              },
              [`& .${tableCellClasses.root}`]: {
                bgcolor: "background.default",
                borderBottomColor: (theme) => theme.palette.divider,
              },
            }}
          >
            <EcommerceAccountOrdersTableToolbar
              rowCount={userOrder.length}
              numSelected={selected.length}
              onSelectAllRows={handleSelectAllRows}
            />

            <Scrollbar>
              <Table
                sx={{
                  minWidth: 720,
                }}
                size={"medium"}
              >
                <EcommerceAccountOrdersTableHead
                  order={order}
                  orderBy={orderBy}
                  onSort={handleSort}
                  headCells={TABLE_HEAD}
                  rowCount={userOrder.length}
                  numSelected={selected.length}
                  onSelectAllRows={handleSelectAllRows}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <EcommerceAccountOrdersTableRow
                        key={row._id}
                        row={row}
                        selected={selected.includes(row._id)}
                        onSelectRow={() => handleSelectRow(row._id)}
                        isUserPage={true}
                      />
                    ))}

                  {emptyRows > 0 && (
                    <TableRow
                      sx={{
                        height: 57 * emptyRows,
                      }}
                    >
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}

                  {notFound && <TableNoData query={filterOrder} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
        <Box sx={{ position: "relative" }}>
          <TablePagination
            page={page}
            component="div"
            count={userOrder.length || 1}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Container>
    </>
  );
}
