import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Box,
  Divider,
  Typography,
  MenuItem,
  Avatar,
  IconButton,
  Popover,
  Tooltip,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { logout } from "src/redux/features/authSlice";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);

  const router = useRouter();

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    setOpen(null);
    dispatch(logout());
    router.push("/auth/login");
  };

  const handleSignIn = () => {
    setOpen(null);
    router.push("/auth/login");
  };

  const handleProfile = () => {
    setOpen(null);
    router.push("/account/personal");
  };

  return (
    <>
      <Tooltip title={userInfo?.email || "guest"}>
        <IconButton
          onClick={handleOpen}
          sx={{
            p: 0,
            ...(open && {
              "&:before": {
                zIndex: 1,
                content: "''",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                position: "absolute",
              },
            }),
          }}
        >
          <Avatar sx={{ width: 34, height: 34 }}>
            {userInfo?.email?.substring(0, 1)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            // width: 180,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {userInfo?.displayName ? `${userInfo.displayName}` : ""}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {userInfo?.email ? `${userInfo.email}` : "Please sign in"}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        <Divider sx={{ borderStyle: "dashed" }} />
        {userInfo ? (
          <Stack sx={{ py: 1 }}>
            <MenuItem onClick={handleProfile} sx={{ mx: 1 }}>
              <Iconify icon="carbon:user" sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ mx: 1 }}>
              <Iconify icon="carbon:logout" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Stack>
        ) : (
          <MenuItem onClick={handleSignIn} sx={{ m: 1 }}>
            Sign In
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
