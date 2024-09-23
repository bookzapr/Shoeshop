"use client";

import PropTypes from "prop-types";

import MainLayout from "src/layouts/main";
import EcommerceLayout from "src/layouts/ecommerce";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userProfile } from "src/redux/actions/authActions";
import { SplashScreen } from "src/components/loading-screen";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const dispatch = useDispatch();

  const { accessToken, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) dispatch(userProfile());
  }, [accessToken, dispatch]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <MainLayout>
      <EcommerceLayout>{children}</EcommerceLayout>
    </MainLayout>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
