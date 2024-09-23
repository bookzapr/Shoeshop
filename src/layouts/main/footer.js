import PropTypes from "prop-types";

import Link from "@mui/material/Link";
import Masonry from "@mui/lab/Masonry";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";

import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import Iconify from "src/components/iconify";

import { footerLinks } from "./config-navigation";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const _socials = [
  {
    value: 'facebook',
    label: 'FaceBook',
    icon: 'carbon:logo-facebook',
    color: '#1877F2',
  },
  {
    value: 'instagram',
    label: 'Instagram',
    icon: 'carbon:logo-instagram',
    color: '#E02D69',
  },
  {
    value: 'linkedin',
    label: 'Linkedin',
    icon: 'carbon:logo-linkedin',
    color: '#007EBB',
  },
  {
    value: 'twitter',
    label: 'Twitter',
    icon: 'carbon:logo-twitter',
    color: '#00AAEC',
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const mdUp = useResponsive("up", "md");

  const pathname = usePathname();

  const mobileList = [];

  const desktopList = footerLinks.sort(
    (listA, listB) => Number(listA.order) - Number(listB.order)
  );

  const renderLists = mdUp ? desktopList : mobileList;

  const isScan = pathname === "/scan";

  const simpleFooter = (
    <Container sx={{ py: 8, textAlign: "center" }}>
      <Typography
        variant="caption"
        component="div"
        sx={{ color: "text.secondary" }}
      >
        © 2024. All rights reserved
      </Typography>
    </Container>
  );

  const mainFooter = (
    <>
      {/* <Divider />

      <Container
        sx={{
          overflow: "hidden",
          py: { xs: 8, md: 10 },
        }}
      >
        <Grid container spacing={3} justifyContent={{ md: "space-between" }}>
          <Grid xs={12} md={4}>
            <Stack spacing={{ xs: 3, md: 5 }}>
              <Stack alignItems="flex-start" spacing={3}>
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

                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa
                  fuga atque illum maxime error quasi, vitae repellendus laborum
                  quia numquam.
                </Typography>
              </Stack>

              <Stack spacing={2}>
                <Stack spacing={1}>
                  <Typography variant="h6">Let’s stay in touch</Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    Ubscribe to our newsletter to receive latest articles to
                    your inbox weekly.
                  </Typography>
                </Stack>

                <TextField
                  fullWidth
                  hiddenLabel
                  placeholder="Email address"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="inherit"
                          size="large"
                          sx={{ mr: -1.25 }}
                        >
                          Subscribe
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Stack>
            </Stack>
          </Grid>

          <Grid xs={12} md={6}>
            {mdUp ? (
              <Masonry
                columns={4}
                spacing={2}
                defaultColumns={4}
                defaultSpacing={2}
              >
                {renderLists.map((list) => (
                  <ListDesktop key={list.subheader} list={list} />
                ))}
                <Stack spacing={2}>
                  <Typography variant="h6">Social</Typography>
                  <Stack direction="row" alignItems="center">
                    {_socials.map((social) => (
                      <IconButton key={social.value} color="primary">
                        <Iconify icon={social.icon} />
                      </IconButton>
                    ))}
                  </Stack>
                </Stack>
              </Masonry>
            ) : (
              <Stack spacing={1.5}>
                {renderLists.map((list) => (
                  <ListMobile key={list.subheader} list={list} />
                ))}
                <Stack spacing={2}>
                  <Typography variant="h6">Social</Typography>
                  <Stack direction="row" alignItems="center">
                    {_socials.map((social) => (
                      <IconButton key={social.value} color="primary">
                        <Iconify icon={social.icon} />
                      </IconButton>
                    ))}
                  </Stack>
                </Stack>
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container> */}

      <Divider />

      <Container>
        <Stack
          spacing={2.5}
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          sx={{ py: 3, textAlign: "center" }}
        >
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            © 2024. All rights reserved
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center">
            <Link variant="caption" sx={{ color: "text.secondary" }}>
              Help Center
            </Link>

            <Link variant="caption" sx={{ color: "text.secondary" }}>
              Terms of Service
            </Link>
          </Stack>
        </Stack>
      </Container>
    </>
  );

  return <footer>{isScan ? simpleFooter : mainFooter}</footer>;
}

// ----------------------------------------------------------------------

export function ListDesktop({ list }) {
  const pathname = usePathname();

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Typography variant="subtitle2">{list.subheader}</Typography>

      {list.items?.map((link) => {
        const active = pathname === link.path || pathname === `${link.path}/`;

        return (
          <Link
            component={RouterLink}
            key={link.title}
            href={link.path}
            variant="caption"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "text.primary",
              },
              ...(active && {
                color: "text.primary",
                fontWeight: "fontWeightSemiBold",
              }),
            }}
          >
            {link.title}
          </Link>
        );
      })}
    </Stack>
  );
}

ListDesktop.propTypes = {
  list: PropTypes.shape({
    items: PropTypes.array,
    subheader: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------

export function ListMobile({ list }) {
  const pathname = usePathname();

  const listExpand = useBoolean();

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      <Typography
        variant="subtitle2"
        onClick={listExpand.onToggle}
        sx={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {list.subheader}
        <Iconify
          width={16}
          icon={
            listExpand.value ? "carbon:chevron-down" : "carbon:chevron-right"
          }
          sx={{ ml: 0.5 }}
        />
      </Typography>

      <Collapse in={listExpand.value} unmountOnExit sx={{ width: 1 }}>
        <Stack spacing={1.5} alignItems="flex-start">
          {list.items?.map((link) => (
            <Link
              component={RouterLink}
              key={link.title}
              href={link.path}
              variant="caption"
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                },
                ...(pathname === `${link.path}/` && {
                  color: "text.primary",
                  fontWeight: "fontWeightSemiBold",
                }),
              }}
            >
              {link.title}
            </Link>
          ))}
        </Stack>
      </Collapse>
    </Stack>
  );
}

ListMobile.propTypes = {
  list: PropTypes.shape({
    items: PropTypes.array,
    subheader: PropTypes.string,
  }),
};

// ----------------------------------------------------------------------
