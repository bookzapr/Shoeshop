import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Iconify from "src/components/iconify";
import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useBoolean } from "src/hooks/use-boolean";
import { toast } from "react-toastify";
import axios from "axios";

// ----------------------------------------------------------------------

export default function ProductTableRow({
  id,
  model,
  brand,
  avatarUrl,
  gender,
  price,
  quantity,
  onDeleted,
}) {
  const [open, setOpen] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const loading = useBoolean(false);

  const router = useRouter();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleOnEdit = () => {
    router.push(`/admin/products/edit/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteProduct = () => {
    setPopupOpen(true);
  };

  const OnDeleteProduct = async () => {
    try {
      loading.onTrue();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${id}`
      );
      setPopupOpen(false);
      toast.success("Product has been deleted");
      onDeleted();
    } catch (error) {
      console.error("Failed to delete Product:", error);
      toast.error("Failed to delete Product");
      setPopupOpen(false);
    }
    loading.onFalse();
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={model} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {model}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{brand}</TableCell>

        <TableCell>{gender}</TableCell>

        <TableCell>฿{price}</TableCell>

        <TableCell>{quantity}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOnEdit}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDeleteProduct} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      >
        <DialogTitle id="crop-dialog-title">Delete Confirmation</DialogTitle>
        <DialogContent dividers style={{ position: "relative" }}>
          <DialogContentText id="alert-dialog-description">
            Confirm to Delete Product: {brand} {model}
          </DialogContentText>
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
            onClick={OnDeleteProduct}
            startIcon={<Iconify icon="eva:trash-2-outline" />}
            loading={loading.value}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

ProductTableRow.propTypes = {
  id: PropTypes.string,
  avatarUrl: PropTypes.any,
  brand: PropTypes.any,
  handleClick: PropTypes.func,
  price: PropTypes.any,
  model: PropTypes.any,
  gender: PropTypes.any,
  quantity: PropTypes.string,
};
