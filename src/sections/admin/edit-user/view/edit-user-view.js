"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFSwitch, RHFTextField } from "src/components/hook-form";
import {
  Button,
  CardHeader,
  Grid,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function EditUserPage({ params }) {
  const loading = useBoolean(true);
  const [user, setUser] = useState({});

  const passwordShow = useBoolean();

  useEffect(() => {
    const fetchUser = async () => {
      loading.onTrue();
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/users/${params.uid}`
        );

        const userData = response.data.data;

        reset({
          name: userData.displayName || "",
          email: userData.email || "",
          isAdmin: userData.isAdmin || false,
        });
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
      }
      loading.onFalse();
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const UserSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters long")
      .required("Name is required"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
  });

  const defaultValues = {
    name: "",
    email: "",
    isAdmin: false,
  };

  const methods = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/users/${params.uid}`,
        {
          newEmail: data.email,
          newName: data.name,
          newPassword: data.password,
          newIsAdmin: data.isAdmin,
        }
      );
      toast.success("Save changed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  });

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* User Details */}
          <Card sx={{ mb: 2 }}>
            <CardHeader title="User Details" />
            <Stack spacing={2.5} sx={{ p: 3 }}>
              <RHFTextField name="name" label="Name" />

              <RHFTextField name="email" label="Email" />

              <RHFTextField
                name="password"
                label="Password"
                type={passwordShow.value ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={passwordShow.onToggle} edge="end">
                        <Iconify
                          icon={
                            passwordShow.value
                              ? "carbon:view"
                              : "carbon:view-off"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <RHFSwitch name="isAdmin" label="isAdmin" />
            </Stack>
          </Card>

          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            justifyContent={"flex-end"}
            spacing={1}
          >
            <Button
              href={"/admin/user"}
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
              Save Edit
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
          <Typography variant="h4">Edit User</Typography>
        </Stack>

        {renderForm}
      </Container>
    </>
  );
}
