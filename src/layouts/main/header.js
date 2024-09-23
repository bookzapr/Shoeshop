import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import { useTheme } from "@mui/material/styles";

import { paths } from "src/routes/paths";

import { useOffSetTop } from "src/hooks/use-off-set-top";
import { useResponsive } from "src/hooks/use-responsive";

import { bgBlur } from "src/theme/css";

import NavMobile from "./nav/mobile";
import NavDesktop from "./nav/desktop";
import { HEADER } from "../config-layout";
import { navConfig } from "./config-navigation";
import HeaderShadow from "../common/header-shadow";
import { Badge, IconButton, Typography } from "@mui/material";
import Iconify from "src/components/iconify";
import { RouterLink } from "src/routes/components";
import { useContext } from "react";
import CartContext from "src/context/CartContext";
import AccountPopover from "./AccountPopover";

// ----------------------------------------------------------------------

export default function Header({ headerOnDark }) {
  const theme = useTheme();

  const offset = useOffSetTop();

  const mdUp = useResponsive("up", "md");

  const { cart } = useContext(CartContext);

  const renderContent = () => {
    return (
      <>
        <Box sx={{ lineHeight: 0, position: "relative" }}>
          <Link
            href="/"
            color="inherit"
            aria-label="go to homepage"
            sx={{ lineHeight: 0 }}
          >
            <Box
              sx={{
                lineHeight: 0,
                cursor: "pointer",
                display: "inline-flex",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                Shoe Shop
              </Typography>
            </Box>
          </Link>
        </Box>

        <>
          <Stack
            flexGrow={1}
            alignItems="center"
            sx={{
              height: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            <NavDesktop data={navConfig} />
          </Stack>

          <Box sx={{ flexGrow: { xs: 1, md: "unset" } }} />
        </>

        <Stack
          spacing={3}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          <Badge badgeContent={cart[0]?.items?.length || 0} color="error">
            <IconButton
              component={RouterLink}
              href={paths.eCommerce.cart}
              size="small"
              color="inherit"
              sx={{ p: 0 }}
            >
              <Iconify icon="carbon:shopping-cart" width={24} />
            </IconButton>
          </Badge>

          <AccountPopover />
        </Stack>

        {!mdUp && <NavMobile data={navConfig} />}
      </>
    );
  };

  return (
    <AppBar>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(["height", "background-color"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(headerOnDark && {
            color: "common.white",
          }),
          ...(offset && {
            ...bgBlur({ color: theme.palette.background.default }),
            color: "text.primary",
            height: {
              md: HEADER.H_DESKTOP - 16,
            },
          }),
        }}
      >
        <Container
          sx={{
            height: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderContent()}
        </Container>
      </Toolbar>

      {offset && <HeaderShadow />}
    </AppBar>
  );
}

Header.propTypes = {
  headerOnDark: PropTypes.bool,
};
