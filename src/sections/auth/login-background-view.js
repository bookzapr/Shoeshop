"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, Divider } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "src/redux/actions/authActions";

// ----------------------------------------------------------------------

export default function LoginBackgroundView() {
  const dispatch = useDispatch();

  const passwordShow = useBoolean();

  const router = useRouter();

  const { accessToken, isLoggedIn, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn || accessToken) {
      router.push("/");
    }
  }, [router, isLoggedIn, accessToken]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("That is not an email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be of minimum 6 characters length"),
  });

  const defaultValues = {
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      dispatch(
        userLogin({
          email: data.email,
          password: data.password,
        })
      );

      if (!error) {
        reset();
      }
    } catch (error) {
      console.error("Login failed", error.response);
    }
  });

  const renderHead = (
    <div>
      <Typography variant="h3" paragraph>
        เข้าสู่ระบบ
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {`ยังไม่เป็นสมาชิกหรอ? `}
        <Link
          component={RouterLink}
          href={paths.registerBackground}
          variant="subtitle2"
          color="primary"
        >
          สมัครสมาชิก
        </Link>
      </Typography>
    </div>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5} alignItems="flex-end">
        <RHFTextField name="email" label="Email address" />

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
                      passwordShow.value ? "carbon:view" : "carbon:view-off"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Divider sx={{ borderStyle: "dashed" }} />

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            {error}
          </Alert>
        )}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}
    </>
  );
}
