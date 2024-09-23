"use client";

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";
import { userProfile } from "src/redux/actions/authActions";

// ----------------------------------------------------------------------

export default function EcommerceAccountPersonalView() {
  const passwordShow = useBoolean();

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const EcommerceAccountPersonalSchema = Yup.object().shape({
    displayName: Yup.string().required("Display name is required"),
    emailAddress: Yup.string().required("Email address is required"),
  });

  const defaultValues = {
    displayName: userInfo?.displayName,
    emailAddress: userInfo?.email,
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(EcommerceAccountPersonalSchema),
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/users/${userInfo?.userId}`,
        {
          newEmail: data.emailAddress,
          newName: data.displayName,
        }
      );
      toast.success("Save changed");
      dispatch(userProfile());
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Personal
      </Typography>

      <RHFTextField name="displayName" label="Display Name" sx={{ mb: 2.5 }} />

      <RHFTextField name="emailAddress" label="Email Address" />

      <Stack spacing={3} sx={{ my: 5 }}>
        <Typography variant="h5"> Change Password </Typography>

        <Stack spacing={2.5}>
          <RHFTextField
            name="oldPassword"
            label="Old Password"
            type={passwordShow.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={passwordShow.onToggle} edge="end">
                    <Iconify
                      icon={
                        passwordShow.value ? "carbon:view" : "carbon:view-off"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="newPassword"
            label="New Password"
            type={passwordShow.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={passwordShow.onToggle} edge="end">
                    <Iconify
                      icon={
                        passwordShow.value ? "carbon:view" : "carbon:view-off"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <RHFTextField
            name="confirmNewPassword"
            label="Confirm New Password"
            type={passwordShow.value ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={passwordShow.onToggle} edge="end">
                    <Iconify
                      icon={
                        passwordShow.value ? "carbon:view" : "carbon:view-off"
                      }
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
      <LoadingButton
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Save Changes
      </LoadingButton>
    </FormProvider>
  );
}
