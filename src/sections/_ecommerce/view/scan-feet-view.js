"use client";

import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Iconify from "src/components/iconify";
import Image from "src/components/image";
import { useBoolean } from "src/hooks/use-boolean";

export default function ScanFeetView() {
  const inputRef = useRef(null);

  const loading = useBoolean(false);

  const [file, setFile] = useState();
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  const [sizeResult, setSizeResult] = useState(0);

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const handleInputClick = (e) => {
    e.target.value = "";
  };

  const handleFileChange = async (e) => {
    if (!e.target.files) {
      return;
    }

    setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);

    loading.onTrue();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_PYTHON_API}/measure-feet`,
        { image: e.target.files[0] },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Image Uploaded!");
      console.log(response.data);
      setSizeResult(response.data.summary);
    } catch (error) {
      toast.error("Upload image failed!");
    }
    loading.onFalse();
  };

  return (
    <Container
      sx={{
        pt: { xs: 5, md: 8 },
      }}
    >
      {/* Working On It.... */}
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Upload Image" />
            {/* Upload Image */}
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
                      width: "300px",
                      height: "300px",
                      display: "flex",
                      alignItems: "center",
                      p: 5,
                      justifyContent: "center",
                    }}
                    dir="ltr"
                  >
                    <Avatar
                      sx={{
                        width: "275px",
                        height: "275px",
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
                      src={imagePreviewUrl}
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
                    onChange={(e) => handleFileChange(e)}
                    onClick={handleInputClick}
                    style={{ display: "none" }}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Result */}
            <Stack spacing={2} sx={{ m: 3 }}>
              <Divider sx={{ borderStyle: "dashed" }} />

              {loading.value && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{ my: 3 }}
                >
                  <CircularProgress />
                </Box>
              )}

              {!loading.value && (
                <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ my: 3 }}>
                  {/* <Typography variant="h5">Result</Typography> */}
                  <Typography>
                    <Button
                      color="inherit"
                      size="large"
                      variant="outlined"
                      startIcon={
                        <Iconify icon="fluent-emoji-flat:running-shoe" />
                      }
                      sx={{ width: "fit-content", p: 4 }}
                    >
                      <Typography variant="h5">
                        Your size is &nbsp;&nbsp;
                        <Typography
                          variant="h5"
                          sx={{ display: "inline-block", fontWeight: "900" }}
                        >
                          {sizeResult}
                        </Typography>{" "}
                        &nbsp;&nbsp;cm
                      </Typography>
                    </Button>
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Card>
        </Grid>

        <Card sx={{ mt: 2 }}>
          <CardHeader title="วิธีวัดขนาดรองเท้าของคุณทางออนไลน์" />
          <Stack spacing={2.5} sx={{ m: 3 }}>
            <Stack spacing={1}>
              <Typography variant="h5">ขั้นตอนที่ 1: เตรียมการของคุณ</Typography>
              <Typography variant="body1">
              ก่อนที่คุณจะเริ่มต้น ตรวจสอบให้แน่ใจว่าคุณมีกระดาษ A4 สีขาว ปากกา และเท้าของคุณพร้อม 
              วางเท้าของคุณบนกระดาษให้แน่นแล้ววาดรอบๆ เพื่อให้เห็นโครงร่างที่ชัดเจน
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack spacing={1}>
              <Typography variant="h5">ขั้นตอนที่ 2: ถ่ายรูปเท้าของตัวเอง</Typography>
              <Image
                src={"/assets/images/barefeet.jpeg"}
                alt="barefeet"
                sx={{ width: 250, height: 250 }}
              />
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            {/* <Stack spacing={1}> */}
            <Typography variant="h5">ขั้นตอนที่ 3: อัปโหลดรูปเท้าตัวเอง</Typography>
            <Typography variant="body1">
              <List sx={{ listStyleType: "disc", pl: 2 }}>
                <ListItem sx={{ display: "list-item" }}>
                ไปที่ส่วน &quot;การวัดขนาดเท้า&quot; บนเว็บไซต์ของเรา
                </ListItem>
                <ListItem sx={{ display: "list-item" }}>
                  คลิก &quot;Upload Image&quot; 
                </ListItem>
                <ListItem sx={{ display: "list-item" }}>
                เลือกรูปภาพที่คุณเพิ่งถ่ายจากอุปกรณ์ของคุณแล้วอัปโหลด
                </ListItem>
              </List>
            </Typography>
            {/* </Stack> */}

            <Divider sx={{ borderStyle: "dashed" }} />

            <Stack spacing={1}>
              <Typography variant="h5">
              ขั้นตอนที่ 4: การประมวลผลภาพของคุณ
              </Typography>
              <Typography variant="body1">
              เมื่ออัพโหลดรูปภาพของคุณแล้ว ระบบของเราจะประมวลผลรูปภาพ
              เพื่อคำนวณขนาดเท้าที่ถูกต้องเป็นเซนติเมตร นี้
              กระบวนการอาจใช้เวลานานถึง 30 วินาที กรุณารอสักครู่ในขณะที่ระบบของเรา
              วิเคราะห์รูปภาพของคุณ
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: "dashed" }} />

            {/* <Stack spacing={1}> */}
            <Typography variant="h5">ขั้นตอนที่ 5: ขนาดเท้าของคุณ</Typography>
            <Typography variant="body1">
              <List sx={{ listStyleType: "disc", pl: 2 }}>
                <ListItem sx={{ display: "list-item" }}>
                หลังจากประมวลผลแล้ว ขนาดเท้าของคุณเป็นเซนติเมตรจะปรากฏบนหน้าจอ
                </ListItem>
                <ListItem sx={{ display: "list-item" }}>
                โปรดดูตารางขนาดรองเท้าของเราด้านล่างผลการค้นหาเพื่อค้นหาขนาดรองเท้าของคุณ
                ขนาดรองเท้าที่สอดคล้องกัน
                </ListItem>
              </List>
            </Typography>
            {/* </Stack> */}
          </Stack>
        </Card>

        <Stack sx={{ mt: 2 }}>
          <Image src={"/assets/images/ShoeSizeChart.png"} alt="" />
        </Stack>
      </Grid>
    </Container>
  );
}
