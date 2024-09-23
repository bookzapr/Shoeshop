import { useEffect } from "react";
import PropTypes from "prop-types";

import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { usePathname } from "src/routes/hooks";

import { useBoolean } from "src/hooks/use-boolean";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

import NavList from "./nav-list";
import { NAV } from "../../../config-layout";
import { Avatar, Divider, Typography } from "@mui/material";
import TextMaxLine from "src/components/text-max-line";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

export default function NavMobile({ data }) {
  const pathname = usePathname();

  const mobileOpen = useBoolean();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (mobileOpen.value) {
      mobileOpen.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <IconButton onClick={mobileOpen.onTrue} sx={{ ml: 2, color: "inherit" }}>
        <Iconify icon="carbon:menu" width={24} />
      </IconButton>

      <Drawer
        open={mobileOpen.value}
        onClose={mobileOpen.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: NAV.W_VERTICAL,
          },
        }}
      >
        <Scrollbar>
          {/* <Logo sx={{ mx: 2.5, my: 3 }} /> */}
          <Typography variant="h4" sx={{ fontWeight: "bold", mx: 2.5, my: 3 }}>
            Shoe Shop
          </Typography>

          <Divider sx={{ borderStyle: "dashed" }} />

          {userInfo && (
            <Stack spacing={2} sx={{ p: 3, pb: 2 }}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Avatar sx={{ width: 64, height: 64 }}>
                  <Typography variant="h3">
                    {userInfo.email?.substring(0, 1)}
                  </Typography>
                </Avatar>
              </Stack>

              <Stack spacing={0.5}>
                <TextMaxLine variant="subtitle1" line={1}>
                  {userInfo.displayName
                    ? userInfo.displayName
                    : `user_${userInfo.userId.substring(0, 10)}`}
                </TextMaxLine>
                <TextMaxLine
                  variant="body2"
                  line={1}
                  sx={{ color: "text.secondary" }}
                >
                  {userInfo.email}
                </TextMaxLine>
              </Stack>
            </Stack>
          )}

          <Divider sx={{ borderStyle: "dashed" }} />

          <List component="nav" disablePadding>
            {data.map((list) => (
              <NavList key={list.title} data={list} />
            ))}
          </List>

          <Divider sx={{ borderStyle: "dashed" }} />

          {userInfo ? (
            <Stack spacing={1.5} sx={{ p: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                href={paths.loginBackground}
                rel="noopener"
              >
                <Iconify icon="carbon:logout" sx={{ mr: 1 }} /> Logout
              </Button>
            </Stack>
          ) : (
            <Stack spacing={1.5} sx={{ p: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="inherit"
                href={paths.loginBackground}
                rel="noopener"
              >
                <Iconify icon="carbon:login" sx={{ mr: 1 }} /> Sign In
              </Button>
            </Stack>
          )}
        </Scrollbar>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
};
