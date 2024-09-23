"use client";

import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useBoolean } from "src/hooks/use-boolean";
import { SplashScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);

  const [isAdmin, setIsAdmin] = useState(true);

  const loading = useBoolean();

  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      loading.onTrue();
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        };
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/`,
          config
        );
        setIsAdmin(response.data.data.isAdmin);
      } catch (error) {
        console.log(error);
      }
      loading.onFalse();
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (loading.value) {
  //   return <SplashScreen />;
  // }

  if (!isAdmin) {
    router.push("/");
  }

  return (
    <>
      {loading.value && <SplashScreen />}

      {!loading.value && (
        <>
          <Header onOpenNav={() => setOpenNav(true)} />

          <Box
            sx={{
              minHeight: 1,
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
            }}
          >
            <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

            <Main>{children}</Main>
          </Box>
        </>
      )}
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
