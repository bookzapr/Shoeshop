"use client";

import { useState, useCallback, useEffect } from "react";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Switch from "@mui/material/Switch";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import FormControlLabel from "@mui/material/FormControlLabel";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import Scrollbar from "src/components/scrollbar";

import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";

import OrderTableToolbar from "src/sections/admin/users/order/order-table-toolbar";
import { CircularProgress, Container, Paper } from "@mui/material";
import EcommerceAccountOrdersTableToolbar from "src/sections/admin/users/order/ecommerce-account-orders-table-toolbar";
import EcommerceAccountOrdersTableHead from "src/sections/admin/users/order/ecommerce-account-orders-table-head";
import EcommerceAccountOrdersTableRow from "src/sections/admin/users/order/ecommerce-account-orders-table-row";
import TableNoData from "src/sections/admin/products/table-no-data";
import {
  applyFilter,
  getComparator,
} from "src/sections/admin/users/order/utils";

// ----------------------------------------------------------------------

const TABS = [
  "All Orders",
  "Completed",
  "Shipping",
  "Processing",
  "Pending",
  "Canceled",
];

export const TABLE_HEAD = [
  { id: "_id", label: "Order ID", minWidth: 140 },
  { id: "user", label: "User ID", minWidth: 140 },
  { id: "item", label: "Item" },
  { id: "createdAt", label: "Purchased date", minWidth: 170 },
  { id: "price", label: "Price", width: 100 },
  { id: "status", label: "Status", width: 100 },
  { id: "" },
];

// ----------------------------------------------------------------------

export default function AllOrdersPage() {
  const [tab, setTab] = useState("All Orders");

  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("_id");

  const [selected, setSelected] = useState([]);

  const [page, setPage] = useState(0);

  const [dense, setDense] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterOrder, setFilterOrder] = useState("");

  const [error, setError] = useState("");

  const loading = useBoolean(true);

  const [userOrder, setUserOrder] = useState([]);

  const statusParamMap = {
    "All Orders": "",
    Completed: "completed",
    Shipping: "shipping",
    Processing: "processing",
    Pending: "pending",
    Canceled: "canceled",
  };

  useEffect(() => {
    const fetchUserOrder = async () => {
      loading.onTrue();
      const status = statusParamMap[tab];
      const statusQuery = status
        ? `?status=${status}&length=100`
        : "?status=&length=100";
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/all${statusQuery}`,
          {
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setUserOrder(response.data.orders);
      } catch (error) {
        console.error("Failed to get user orders:", error);
        setError("Failed to get user orders");
      } finally {
        loading.onFalse();
      }
    };

    fetchUserOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleChangeTab = useCallback((event, newValue) => {
    setTab(newValue);
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

  const handleChangeDense = useCallback((event) => {
    setDense(event.target.checked);
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
        </Stack>

        <Tabs
          value={tab}
          scrollButtons="auto"
          variant="scrollable"
          allowScrollButtonsMobile
          onChange={handleChangeTab}
        >
          {TABS.map((category) => (
            <Tab key={category} value={category} label={category} />
          ))}
        </Tabs>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
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

        {!loading.value && !error && (
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
                size={dense ? "small" : "medium"}
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
                      />
                    ))}

                  {emptyRows > 0 && (
                    <TableRow
                      sx={{
                        height: (dense ? 36 : 57) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}

                  {userOrder.length == 0 && (
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="body2" paragraph>
                            No {tab} order...
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  )}

                  {notFound && <TableNoData query={filterOrder} />}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}

        {error && (
          <Stack sx={{ mb: 4, mt: 2 }}>
            <Typography variant="h6" paragraph>
              Not found
            </Typography>

            <Typography variant="body2">{error}</Typography>
          </Stack>
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

          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
            sx={{
              pl: 2,
              py: 1.5,
              top: 0,
              position: {
                sm: "absolute",
              },
            }}
          />
        </Box>
      </Container>
    </>
  );
}
