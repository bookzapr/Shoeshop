"use client";

import { v4 as uuidv4 } from "uuid";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFSelect, RHFTextField } from "src/components/hook-form";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import Iconify from "src/components/iconify";
import { Box } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import getCroppedImg from "src/utils/cropImage";
import Cropper from "react-easy-crop";
import { useBoolean } from "src/hooks/use-boolean";
import axios from "axios";
import { toast } from "react-toastify";

// ----------------------------------------------------------------------

const brands = ["Nike", "Adidas", "New Balance", "Puma"];

const genders = ["Male", "Female", "Kids"];

const SIZE_OPTIONS = [
  3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5,
  12, 12.5, 13, 13.5, 14, 15,
];

export const COLOR_OPTIONS = [
  { label: "Black", color: "#000000" },
  { label: "Blue", color: "#2563eb" },
  { label: "Brown", color: "#92400e" },
  { label: "Green", color: "#16a34a" },
  { label: "Grey", color: "#6b7280" },
  { label: "Orange", color: "#f97316" },
  { label: "Pink", color: "#fb7185" },
  { label: "Purple", color: "#9333ea" },
  { label: "Red", color: "#dc2626" },
  { label: "White", color: "#ffffff" },
  { label: "Yellow", color: "#facc15" },
  { label: "Cyan", color: "#06b6d4" },
];

const TYPE_OPTIONS = [
  "Work",
  "Running",
  "Trail",
  "Basketball",
  "Casual",
  "Sandals",
];

// ----------------------------------------------------------------------

export default function EditProductPage({ params }) {
  const inputRef = useRef(null);

  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState([]);
  const [cropImg, setCropImg] = useState();
  const [isSizeValid, setIsSizeValid] = useState(true);
  const [isFileValid, setIsFileValid] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImagew, setCroppedImagew] = useState(null);

  const [colorSizes, setColorSizes] = useState([]);

  const loading = useBoolean(true);
  const [product, setProduct] = useState({});

  const shoeId = params;

  const [updateTrigger, setUpdateTrigger] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      loading.onTrue();
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}`;
        const response = await axios.get(url);
        const productData = response.data.data;

        setProduct(productData);

        const parsedColorSizes = productData.colors.map((color) => ({
          id: color._id,
          name: color.name,
          hex: color.hex,
          imagePreview: null,
          sizes: SIZE_OPTIONS.map((sizeOption) => {
            const existingSize = color.sizes.find((s) => s.size === sizeOption);
            return {
              id: existingSize ? existingSize._id : uuidv4(),
              size: sizeOption,
              quantity: existingSize ? existingSize.quantity : 0,
            };
          }),
        }));

        setColorSizes(parsedColorSizes);

        reset({
          brand: productData.brand || "",
          model: productData.model || "",
          gender: productData.gender || "",
          type: productData.type || "",
          description: productData.description || "",
          price: productData.price || "",
          colors: parsedColorSizes,
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
      loading.onFalse();
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.pid, updateTrigger]);

  const toggleUpdateTrigger = () => {
    setUpdateTrigger((prev) => !prev);
  };

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
    console.log("Submitted data:", data);

    const payload = {
      brand: data.brand,
      model: data.model,
      type: data.type,
      gender: data.gender,
      description: data.description,
      price: data.price,
    };

    // console.log("Payload to send:", payload);

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}`;
      const response = await axios.put(url, payload);
      console.log("Update successful:", response);
      toast.success("Update successfully!");
      toggleUpdateTrigger();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again later.");
    }
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(cropImg, croppedAreaPixels, 0);
      setCroppedImagew(croppedImage);
      setImagePreviewUrl(URL.createObjectURL(croppedImage));
      setPopupOpen(false);
      setFile(croppedImage);
    } catch (e) {
      console.error(e);
    }
    console.log("success");
  }, [cropImg, croppedAreaPixels]);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleInputClick = (e) => {
    e.target.value = "";
  };

  const handleFileChange = (e, colorId) => {
    if (!e.target.files) {
      return;
    }

    const img = new Image();
    const reader = new FileReader();
    reader.onloadend = () => {
      img.src = reader.result;
      img.onload = async function () {
        setImagePreviewUrl(reader.result);
        setFile(e.target.files[0]);
        setColorSizes((currentColorSizes) =>
          currentColorSizes.map((color) =>
            color.id === colorId
              ? { ...color, imagePreview: reader.result }
              : color
          )
        );

        loading.onTrue();
        try {
          await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${colorId}`,
            { image: e.target.files[0] },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          toast.success("Image Uploaded!");
          toggleUpdateTrigger();
        } catch (error) {
          toast.error("Upload image failed!");
        }
        loading.onFalse();
      };
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleAddColorSize = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}`
      );
      toast.success("Color Block Created!");
      toggleUpdateTrigger();
    } catch (error) {
      toast.error("Please complete the empty color!");
    }
  };

  // Handler to delete a specific color-size grid
  const handleDeleteColorSize = async (id) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}/colors/${id}`;
      const response = await axios.delete(url);
      console.log("Delete successful:", response);
      toast.success("Delete color successfully!");
      // toggleUpdateTrigger();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product. Please try again later.");
    }

    setColorSizes((currentColorSizes) =>
      currentColorSizes.filter((colorSize) => colorSize.id !== id)
    );
  };

  const handleSaveColorSize = handleSubmit(async (data, id) => {
    // console.log(data);
    const payload = data.colors
      .filter((color) => color.id === id)
      .map((color) => ({
        ...color,
        sizes: color.sizes.map((size) => ({
          ...size,
          quantity: parseInt(size.quantity, 10) || 0, // Convert quantity to integer
        })),
      }))[0]; // Extract the first element since filter returns an array

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/shoes/${params.pid}/colors/${id}`;
      const response = await axios.put(url, payload);
      console.log("Update successful:", response);
      toast.success("Update color successfully!");
      toggleUpdateTrigger();
    } catch (error) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product. Please try again later.");
    }
  });

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Product Details */}
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Product Details" />
            <Stack spacing={2.5} sx={{ p: 3 }}>
              <RHFSelect name="brand" label="Brand">
                {brands.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="model" label="Model" />

              <RHFSelect name="type" label="Type">
                {TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFSelect name="gender" label="Gender">
                {genders.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </RHFSelect>

              <RHFTextField name="description" label="Description" />
            </Stack>
          </Card>

          {/* Price */}
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Price" />
            <Stack spacing={2.5} sx={{ p: 3 }}>
              <RHFTextField name="price" label="Price" />
            </Stack>
          </Card>

          {/* colors */}
          {colorSizes.map((colorSize, colorIndex) => (
            <Grid container spacing={2} key={colorSize.id} sx={{ mb: 2 }}>
              {/* Image */}
              <Grid item xs={12} md={12} lg={4}>
                <Card>
                  <Grid container>
                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 4,
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Box
                          sx={{
                            border: "1px dashed rgba(145, 158, 171, 0.32)",
                            borderRadius: "10px",
                            width: "200px",
                            height: "200px",
                            display: "flex",
                            alignItems: "center",
                            p: 5,
                            justifyContent: "center",
                          }}
                          dir="ltr"
                        >
                          <Avatar
                            sx={{
                              width: "175px",
                              height: "175px",
                              fontSize: "14px",
                              borderRadius: "10px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "#F7F9FA",
                              cursor: "pointer",
                              "&:hover": {
                                opacity: 0.7,
                              },
                            }}
                            onClick={handleUploadClick}
                            alt="shoe"
                            variant="square"
                            src={
                              colorSize.imagePreview ||
                              `${process.env.NEXT_PUBLIC_BACKEND_API}/api/v1/images/${colorSize.id}`
                            }
                          >
                            <>
                              <Iconify icon="carbon:cloud-upload" />
                              <Typography
                                variant="caption"
                                color="textSecondary"
                                sx={{ display: "block", textAlign: "center" }}
                              >
                                Click to upload
                              </Typography>
                            </>
                          </Avatar>
                        </Box>
                      </Paper>

                      <Box sx={{ p: 0, pb: 0 }}>
                        <input
                          type="file"
                          accept="image/*"
                          ref={inputRef}
                          onChange={(e) => handleFileChange(e, colorSize.id)}
                          onClick={handleInputClick}
                          style={{ display: "none" }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
              {/* color / size / qty */}
              <Grid item xs={12} md={12} lg={7} sx={{ mb: 2 }}>
                <Card>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<Iconify icon="carbon:chevron-down" />}
                      sx={{ px: 2 }}
                    >
                      <CardHeader
                        sx={{ p: 1 }}
                        title="Color / Size / Quantity"
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack
                        spacing={2.5}
                        sx={{
                          px: 3,
                          pb: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <RHFSelect
                          name={`colors[${colorIndex}].name`}
                          label="Color"
                          defaultValue={colorSize.name}
                        >
                          {COLOR_OPTIONS.map((option) => (
                            <MenuItem
                              key={option.label}
                              value={option.label}
                              sx={{ color: option.color }}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </RHFSelect>
                        <Divider sx={{ borderStyle: "dashed" }} />

                        <Grid container spacing={2}>
                          {colorSize.sizes.map((sizeObj, sizeIndex) => (
                            <Grid item xs={2} key={sizeObj.id}>
                              <Button
                                variant={"outlined"}
                                color={"inherit"}
                                fullWidth
                                sx={{ mb: 2 }}
                              >
                                {sizeObj.size}
                              </Button>
                              <RHFTextField
                                name={`colors[${colorIndex}].sizes[${sizeIndex}].quantity`}
                                label="Quantity"
                                defaultValue={sizeObj.quantity}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                </Card>
              </Grid>
              {/* Button */}
              <Grid item xs={12} md={12} lg={1}>
                {/* Delete button */}
                <Button
                  color="error"
                  size="large"
                  variant="contained"
                  onClick={() => handleDeleteColorSize(colorSize.id)}
                  sx={{ mb: 1 }}
                >
                  <Iconify icon="carbon:trash-can" />
                </Button>
                <Button
                  color="success"
                  size="large"
                  variant="contained"
                  onClick={() => handleSaveColorSize(colorSize.id)}
                >
                  <Iconify icon="carbon:save" />
                </Button>
              </Grid>
            </Grid>
          ))}

          <Stack
            direction={"row"}
            alignItems={"flex-end"}
            justifyContent={"space-between"}
            spacing={1}
          >
            <Button
              color="info"
              size="large"
              variant="contained"
              onClick={handleAddColorSize}
              startIcon={<Iconify icon="carbon:add" />}
            >
              Add more
            </Button>
            <Stack direction={"row"} spacing={1}>
              <Button
                href="/admin/products"
                color="error"
                size="large"
                variant="contained"
              >
                Cancel
              </Button>
              <LoadingButton
                color="success"
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting}
              >
                Save Edit
              </LoadingButton>
            </Stack>
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
          <Typography variant="h4">Edit product</Typography>
        </Stack>

        {loading.value && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        )}

        {!loading.value && renderForm}
      </Container>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        aria-labelledby="crop-dialog-title"
        aria-describedby="crop-dialog-description"
        PaperProps={{
          sx: {
            height: "80%",
            width: "90%",
            maxWidth: "800px",
          },
        }}
      >
        <DialogTitle id="crop-dialog-title">Crop Image</DialogTitle>
        <DialogContent dividers style={{ position: "relative" }}>
          <Grid
            container
            style={{ height: "calc(100% - 50px)", overflow: "auto" }}
          >
            <Grid item xs={12} md={12} lg={12}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                <Cropper
                  image={cropImg}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setPopupOpen(false)}
            startIcon={<Iconify icon="eva:close-outline" />}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={showCroppedImage}
            startIcon={<Iconify icon="eva:download-outline" />}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
