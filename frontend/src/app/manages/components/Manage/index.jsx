import React from "react"; 
import { Container, Grid, Card, CardContent, Typography, Button } from "@mui/material";
import { Box } from "@mui/system";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ReceiptIcon from "@mui/icons-material/Receipt";

const sections = [
  { title: "Quản lý Tòa nhà", path: "/buildings", icon: <HomeWorkIcon fontSize="large" /> },
  { title: "Quản lý Căn hộ", path: "/apartments", icon: <ApartmentIcon fontSize="large" /> },
  { title: "Quản lý Dân cư", path: "/residents", icon: <PeopleIcon fontSize="large" /> },
];

const additionalSections = [
  { title: "Quản lý Thông báo", path: "/notifications", icon: <NotificationsActiveIcon fontSize="large" /> },
  { title: "Quản lý Báo cáo", path: "/reports", icon: <AssessmentIcon fontSize="large" /> },
  { title: "Quản lý Hóa đơn Thanh toán", path: "/invoices", icon: <ReceiptIcon fontSize="large" /> },
];

const Manage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "green", mb: 3 }}>
        Quản Lý
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {sections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                background: "#fff",
                color: "#333",
                borderRadius: "16px",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box mb={2}>{section.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  {section.title}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": { backgroundColor: "#003366" },
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                  }}
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 3 }}>
        {additionalSections.map((section, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                textAlign: "center",
                p: 3,
                background: "#fff",
                color: "#333",
                borderRadius: "16px",
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardContent>
                <Box mb={2}>{section.icon}</Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  {section.title}
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    "&:hover": { backgroundColor: "#003366" },
                    borderRadius: "20px",
                    px: 3,
                    py: 1,
                  }}
                >
                  Quản lý
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Manage;
