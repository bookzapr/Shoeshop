"use client";

import PropTypes from "prop-types";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import { alpha } from "@mui/material/styles";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";

import { paths } from "src/routes/paths";
import { useActiveLink } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useResponsive } from "src/hooks/use-responsive";

import Iconify from "src/components/iconify";
import TextMaxLine from "src/components/text-max-line";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@mui/material";
import { logout } from "src/redux/features/authSlice";
import { useRouter } from "next/navigation";
import { useCurrentRole } from "src/hooks/use-current-role";
import Label from "src/components/label";

// ----------------------------------------------------------------------

const navigations = [
  {
    title: "Personal Info",
    path: paths.eCommerce.account.personal,
    icon: <Iconify icon="carbon:user" />,
  },
  {
    title: "Orders",
    path: paths.eCommerce.account.orders,
    icon: <Iconify icon="carbon:document" />,
  },
];

// ----------------------------------------------------------------------

export default function Nav({ open, onClose }) {
  const mdUp = useResponsive("up", "md");

  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  const dispatch = useDispatch();

  const role = useCurrentRole();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const renderContent = (
    <Stack
      sx={{
        flexShrink: 0,
        borderRadius: 2,
        width: 1,
        ...(mdUp && {
          width: 280,
          border: (theme) =>
            `solid 1px ${alpha(theme.palette.grey[500], 0.24)}`,
        }),
      }}
    >
      <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar sx={{ width: 64, height: 64 }}>
            <Typography variant="h3">
              {userInfo?.email?.substring(0, 1)}
            </Typography>
          </Avatar>
        </Stack>

        <Stack spacing={0.5}>
          <TextMaxLine variant="subtitle1" line={1}>
            {userInfo?.displayName
              ? userInfo?.displayName
              : `user_${userInfo?.userId.substring(0, 10)}`}
          </TextMaxLine>
          <TextMaxLine
            variant="body2"
            line={1}
            sx={{ color: "text.secondary" }}
          >
            {userInfo?.email}
          </TextMaxLine>
          <TextMaxLine variant="body2" line={1} sx={{ mt: 0.5 }}>
            {role ? (
              <Label color="info">Admin</Label>
            ) : (
              <Label color="success">Member</Label>
            )}
          </TextMaxLine>
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Stack sx={{ my: 1, px: 2 }}>
        {navigations.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </Stack>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Stack sx={{ my: 1, px: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            px: 1,
            height: 44,
            borderRadius: 1,
          }}
        >
          <ListItemIcon>
            <Iconify icon="carbon:logout" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              typography: "body2",
            }}
          />
        </ListItemButton>
      </Stack>
    </Stack>
  );

  return (
    <>
      {mdUp ? (
        renderContent
      ) : (
        <Drawer
          open={open}
          onClose={onClose}
          PaperProps={{
            sx: {
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

Nav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const active = useActiveLink(item.path);

  return (
    <Link
      component={RouterLink}
      key={item.title}
      href={item.path}
      color={active ? "primary" : "inherit"}
      underline="none"
    >
      <ListItemButton
        sx={{
          px: 1,
          height: 44,
          borderRadius: 1,
        }}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            typography: "body2",
            ...(active && {
              typography: "subtitle2",
            }),
          }}
        />
      </ListItemButton>
    </Link>
  );
}

NavItem.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    path: PropTypes.string,
    title: PropTypes.string,
  }),
};
