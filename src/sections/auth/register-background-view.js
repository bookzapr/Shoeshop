"use client";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import InputAdornment from "@mui/material/InputAdornment";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import FormProvider, { RHFTextField } from "src/components/hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

export default function RegisterBackgroundView() {
  const [error, setError] = useState(false);

  const passwordShow = useBoolean();

  const router = useRouter();

  const dispatch = useDispatch();

  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [router, accessToken]);

  const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("That is not an email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password should be of minimum 6 characters length"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Password's not match"),
  });

  const defaultValues = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/auth/users`,
        { email: data.email, password: data.password }
      );
      reset();
      toast.success("Register successfully!");
      router.push("/auth/login");
    } catch (error) {
      setError(true);
      console.error(error);
      setTimeout(() => {
        setError(false);
      }, 5000);
    }
  });

  const renderHead = (
    <div>
      <Typography variant="h3" paragraph>
        สมัครสมาชิก
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {`เป็นสมาชิกอยู่แล้ว? `}
        <Link
          component={RouterLink}
          href={paths.loginBackground}
          variant="subtitle2"
          color="primary"
        >
          เข้าสู้ระบบ
        </Link>
      </Typography>
    </div>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
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

        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
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

        {error && (
          <Alert severity="error" sx={{ width: "100%" }}>
            Email already in used
          </Alert>
        )}

        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Register
        </LoadingButton>

        {/* <Typography
          variant="caption"
          align="center"
          sx={{ color: "text.secondary", mt: 3 }}
        >
          {`I agree to `}
          <Link color="text.primary" href="#" underline="always">
            Terms of Service
          </Link>
          {` and `}
          <Link color="text.primary" href="#" underline="always">
            Privacy Policy.
          </Link>
        </Typography> */}
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
