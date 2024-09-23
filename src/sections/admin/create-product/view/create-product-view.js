"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import { Button, CardHeader, Divider, Grid, MenuItem } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

const brands = ["Nike", "Adidas", "New Balance", "Puma"];
const genders = ["Male", "Female", "Kids"];

const TYPE_OPTIONS = [
  "Work",
  "Running",
  "Trail",
  "Basketball",
  "Casual",
  "Sandals",
];

export default function CreateProductPage() {
  const router = useRouter();
  const ProductSchema = Yup.object().shape({
    brand: Yup.string().required("Brand is required"),
    model: Yup.string().required("Model is required"),
    gender: Yup.string().required("Gender is required"),
    type: Yup.string().required("Type is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be a positive number")
      .integer("Price must be an integer"),
    description: Yup.string().required("Description is required"),
  });

  const defaultValues = {
    brand: "",
    model: "",
    gender: "",
    type: "",
    price: "",
    description: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProductSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes`,
        data
      );
      toast.success("Create Shoe Successfully!");
      reset();
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create shoe!");
    }
  });

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Product Details" />
            <Stack spacing={2.5} sx={{ p: 3 }}>
              <RHFSelect name="brand" label="Brand">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {brands.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="model" label="Model" />

              <RHFSelect name="type" label="Type">
                <MenuItem value="">None</MenuItem>
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="gender" label="Gender">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: "dashed" }} />
                {genders.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="description" label="Description" />
            </Stack>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardHeader title="Price" />
            <Stack spacing={2.5} sx={{ p: 3 }}>
              <RHFTextField name="price" label="Price" />
            </Stack>
          </Card>

          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            spacing={1}
          >
            <Button
              href="/admin/products"
              color="error"
              size="large"
              variant="contained"
            >
              Cancel
            </Button>
            <LoadingButton
              color="inherit"
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Create Product
            </LoadingButton>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );

  return (
    <>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4">Create a new product</Typography>
        </Stack>

        {renderForm}
      </Container>
    </>
  );
}
