import { useState } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
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
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { useBoolean } from "src/hooks/use-boolean";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function UserTableRow({ id, email, name, isAdmin, onDeleted }) {
  const [open, setOpen] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const loading = useBoolean(false);

  const router = useRouter();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleOnEdit = () => {
    router.push(`/admin/user/edit/${id}`);
  };

  const handleOnOrder = () => {
    router.push(`/admin/user/order/${id}`);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleDeleteUser = () => {
    setPopupOpen(true);
  };

  const OnDeleteUser = async () => {
    try {
      loading.onTrue();
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/users/${id}`
      );
      loading.onFalse();
      setPopupOpen(false);
      toast.success("User has been deleted");
      onDeleted();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>{id}</TableCell>

        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {email}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{name}</TableCell>

        <TableCell align="center">{isAdmin ? "Admin" : "User"}</TableCell>

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

        {/* <MenuItem onClick={handleOnOrder}>
          <Iconify icon="eva:inbox-fill" sx={{ mr: 2 }} />
          Order
        </MenuItem> */}

        <MenuItem onClick={handleDeleteUser} sx={{ color: "error.main" }}>
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
            Confirm to Delete User: {email}
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
            onClick={OnDeleteUser}
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

UserTableRow.propTypes = {
  id: PropTypes.string,
  email: PropTypes.any,
  name: PropTypes.any,
  isAdmin: PropTypes.bool,
  onDeleted: PropTypes.func,
};
