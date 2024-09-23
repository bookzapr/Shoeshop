import PropTypes from "prop-types";
import { useState, useCallback, useEffect } from "react";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import InputBase, { inputBaseClasses } from "@mui/material/InputBase";

//  utils
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import Iconify from "src/components/iconify";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import {
  Avatar,
  AvatarGroup,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFSelect } from "src/components/hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  "Completed",
  "Shipping",
  "Processing",
  "Pending",
  "Canceled",
];

// ----------------------------------------------------------------------

export default function EcommerceAccountOrdersTableRow({
  row,
  onSelectRow,
  selected,
  isUserPage = false,
  toggleUpdateTrigger,
}) {
  const [open, setOpen] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const loading = useBoolean(true);
  const [orderImage, setOrderImage] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchOrderImages = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/${row._id}`
        );
        setOrderImage(
          response.data.order.order.items.map((img) => img.colorId)
        );
      } catch (error) {
        console.error("Failed to get user orders:", error);
        // toast.error("Failed to get user orders");
      }
      loading.onFalse();
    };

    fetchOrderImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row._id]);

  const StatusSchema = Yup.object().shape({
    status: Yup.string().required("Status is required"),
  });

  const defaultValues = {
    status: row.status,
  };

  const methods = useForm({
    resolver: yupResolver(StatusSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onUpdateStatus = handleSubmit(async (data) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/${row._id}?status=${data.status}`
      );
      toast.success("Status updated!");
      setPopupOpen(false);
      setOpen(false);
      // toggleUpdateTrigger();
    } catch (error) {
      console.error("Failed to get user orders:", error);
      toast.error("Update status failed!");
    }
  });

  const handleOpen = useCallback((event) => {
    setOpen(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(null);
  }, []);

  const inputStyles = {
    pl: 1,
    [`&.${inputBaseClasses.focused}`]: {
      bgcolor: "action.selected",
    },
  };

  const handleUpdate = () => {
    setPopupOpen(true);
  };

  const handleView = () => {
    router.push(`/admin/orders/summary/${row._id}`);
  };

  const handleUserViewOrder = () => {
    router.push(`/account/orders/${row._id}`);
  };

  const handleCancelOrder = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/orders/${row._id}?status=Canceled`
      );
      toast.success("Canceled Order!");
    } catch (error) {
      console.error("Failed to get user orders:", error);
      toast.error("Failed canceled Order!");
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox color="primary" checked={selected} onClick={onSelectRow} />
        </TableCell>

        {!isUserPage && (
          <TableCell sx={{ px: 1 }}>
            <InputBase value={row._id} sx={inputStyles} />
          </TableCell>
        )}

        <TableCell sx={{ px: 1 }}>
          <InputBase value={row.user} sx={inputStyles} />
        </TableCell>

        <TableCell sx={{ px: 1 }}>
          <AvatarGroup max={4}>
            {orderImage.map((imgId, index) => (
              <Avatar
                key={index}
                alt="product shoe"
                src={`${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${imgId}`}
              />
            ))}
          </AvatarGroup>
        </TableCell>

        <TableCell>{fDate(row.createdAt)}</TableCell>

        <TableCell sx={{ px: 1 }}>
          <InputBase
            value={
              "฿" +
              row.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )
            }
            sx={inputStyles}
          />
        </TableCell>

        <TableCell>
          <Label
            color={
              (row.status === "Completed" && "success") ||
              (row.status === "Pending" && "warning") ||
              (row.status === "Canceled" && "error") ||
              (row.status === "Processing" && "secondary") ||
              (row.status === "Shipping" && "info") ||
              "default"
            }
          >
            {row.status}
          </Label>
        </TableCell>

        <TableCell align="right" padding="none">
          <IconButton onClick={handleOpen}>
            <Iconify icon="carbon:overflow-menu-vertical" />
          </IconButton>
        </TableCell>
      </TableRow>

      {isUserPage ? (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: { width: 160 },
            },
          }}
        >
          <MenuItem onClick={handleUserViewOrder}>
            <Iconify icon="carbon:view" sx={{ mr: 1 }} /> View
          </MenuItem>
          {row.status == "Pending" && (
            <MenuItem onClick={handleCancelOrder}>
              <Iconify icon="carbon:trash-can" sx={{ mr: 1 }} /> Cancel
            </MenuItem>
          )}
        </Popover>
      ) : (
        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: { width: 160 },
            },
          }}
        >
          <MenuItem onClick={handleView}>
            <Iconify icon="carbon:view" sx={{ mr: 1 }} /> View
          </MenuItem>

          <MenuItem onClick={handleUpdate}>
            <Iconify icon="carbon:update-now" sx={{ mr: 1 }} /> Update
          </MenuItem>
        </Popover>
      )}

      <Dialog
        fullWidth
        maxWidth="sm"
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      >
        <FormProvider methods={methods} onSubmit={onUpdateStatus}>
          <DialogTitle id="crop-dialog-title">Update Status</DialogTitle>
          <DialogContent dividers style={{ position: "relative" }}>
            <RHFSelect name="status" label="Status">
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </RHFSelect>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setPopupOpen(false)}
              startIcon={<Iconify icon="eva:close-outline" />}
            >
              Cancel
            </Button>
            <LoadingButton
              color="error"
              variant="contained"
              type="submit"
              startIcon={<Iconify icon="eva:trash-2-outline" />}
              loading={isSubmitting}
            >
              Confirm
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}

EcommerceAccountOrdersTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
};
