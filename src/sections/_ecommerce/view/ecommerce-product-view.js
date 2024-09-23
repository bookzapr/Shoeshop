"use client";

import { useEffect, useState } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import Container from "@mui/material/Container";

import { useBoolean } from "src/hooks/use-boolean";

import { SplashScreen } from "src/components/loading-screen";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import EcommerceProductDetailsInfo from "../product/details/ecommerce-product-details-info";
import EcommerceProductDetailsCarousel from "../product/details/ecommerce-product-details-carousel";
import EcommerceProductDetailsDescription from "../product/details/ecommerce-product-details-description";
import { paths } from "src/routes/paths";
import axios from "axios";

// ----------------------------------------------------------------------

export default function EcommerceProductView({ params }) {
  const loading = useBoolean(true);

  const [product, setProduct] = useState({});

  const [productImage, setProductImage] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      loading.onTrue();
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}`;
        const response = await axios.get(url);

        setProduct(response.data.data);
        const images = response.data.data.colors.map((color) => ({
          image: `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${color._id}`,
          name: color.name,
        }));
        setProductImage(images);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
      loading.onFalse();
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.pid]);

  if (loading.value && productImage) {
    return <SplashScreen />;
  }

  return (
    <>
      <Container sx={{ overflow: "hidden" }}>
        <CustomBreadcrumbs
          links={[
            {
              name: "Home",
              href: paths.eCommerce.root,
            },
            {
              name: "Products",
              href: paths.eCommerce.products,
            },
            {
              name: product.brand + " " + product.model,
            },
          ]}
          sx={{ my: 5 }}
        />

        <Grid container spacing={{ xs: 5, md: 8 }}>
          <Grid xs={12} md={6} lg={7}>
            <EcommerceProductDetailsCarousel images={productImage} />
          </Grid>

          <Grid xs={12} md={6} lg={5}>
            <EcommerceProductDetailsInfo
              id={product._id}
              name={product.brand + " " + product.model}
              price={product.price}
              image={""}
              caption={product.description}
              priceSale={product.price}
              items={product?.colors?.map(({ name, sizes, _id }) => ({
                name,
                sizes,
                _id,
              }))}
              colors={product?.colors}
              totalQty={product.total_quantity}
            />
          </Grid>
        </Grid>

        <Grid container columnSpacing={{ md: 8 }}>
          <Grid xs={12} md={6} lg={7}>
            <EcommerceProductDetailsDescription
              description={product.description || "No description"}
              specifications={[
                { label: "Category", value: "Shoe" },
                { label: "Brand", value: product.brand },
                { label: "Model", value: product.model },
                { label: "Gender", value: product.gender },
                { label: "Type", value: product.type },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
