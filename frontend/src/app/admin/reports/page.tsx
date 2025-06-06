"use client";

import React, { useState, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Paper,
    Button,
    SelectChangeEvent,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    FinancialOverview,
    Charts,
    DebtTable,
    ExportActions,
    ServiceUsageReport,
    BuildingOccupancyReport,
    PaymentAnalyticsReport,
    ApartmentOverview,
    ApartmentCharts,
} from "./components";
import { useReportsData } from "./hooks/useReportsData";
const Reports = () => {
    const [selectedReport, setSelectedReport] = useState("financial");
    const [dateRange, setDateRange] = useState("month");
    const printRef = useRef<HTMLDivElement>(null);

    const {
        financialData,
        apartmentData,
        serviceUsageData,
        buildingOccupancyData,
        paymentAnalyticsData,
        loading,
        error,
    } = useReportsData(selectedReport, dateRange);

    const handleReportChange = (event: SelectChangeEvent) => {
        setSelectedReport(event.target.value);
    };

    const handleDateRangeChange = (event: SelectChangeEvent) => {
        setDateRange(event.target.value);
    };

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="400px"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    const renderFinancialReport = () => {
        if (!financialData) return null;

        return (
            <Box>
                <FinancialOverview data={financialData} />

                <Box sx={{ mt: 3 }}>
                    <Charts data={financialData} reportType="financial" />
                </Box>

                <Box sx={{ mt: 3 }}>
                    <DebtTable data={financialData.debt} />
                </Box>
            </Box>
        );
    };

    const renderApartmentReport = () => {
        if (!apartmentData) return null;

        return (
            <Box>
                <ApartmentOverview data={apartmentData} />

                <Box sx={{ mt: 3 }}>
                    <ApartmentCharts data={apartmentData} />
                </Box>
            </Box>
        );
    };

    const renderServiceUsageReport = () => {
        if (!serviceUsageData) return null;

        return (
            <Box>
                <ServiceUsageReport data={serviceUsageData} />
            </Box>
        );
    };

    const renderBuildingOccupancyReport = () => {
        if (!buildingOccupancyData) return null;

        return (
            <Box>
                <BuildingOccupancyReport data={buildingOccupancyData} />
            </Box>
        );
    };

    const renderPaymentAnalyticsReport = () => {
        if (!paymentAnalyticsData) return null;

        return (
            <Box>
                <PaymentAnalyticsReport data={paymentAnalyticsData} />
            </Box>
        );
    };

    const getCurrentReportData = () => {
        if (selectedReport === "financial") return financialData;
        if (selectedReport === "apartment") return apartmentData;
        if (selectedReport === "service-usage") return serviceUsageData;
        if (selectedReport === "building-occupancy")
            return buildingOccupancyData;
        if (selectedReport === "payment-analytics") return paymentAnalyticsData;
        return null;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box
                sx={{
                    mb: 4,
                    backgroundColor: "background.paper",
                    p: 3,
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    color="text.primary"
                >
                    Bảng điều khiển Báo cáo
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Xem và phân tích báo cáo tài chính và căn hộ
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Loại Báo cáo</InputLabel>
                            <Select
                                value={selectedReport}
                                label="Loại Báo cáo"
                                onChange={handleReportChange}
                            >
                                <MenuItem value="financial">
                                    Báo cáo Tài chính
                                </MenuItem>
                                <MenuItem value="apartment">
                                    Báo cáo Căn hộ
                                </MenuItem>
                                <MenuItem value="service-usage">
                                    Báo cáo Sử dụng Dịch vụ
                                </MenuItem>
                                <MenuItem value="building-occupancy">
                                    Báo cáo Lấp đầy Tòa nhà
                                </MenuItem>
                                <MenuItem value="payment-analytics">
                                    Báo cáo Phân tích Thanh toán
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Khoảng thời gian</InputLabel>
                            <Select
                                value={dateRange}
                                label="Khoảng thời gian"
                                onChange={handleDateRangeChange}
                            >
                                <MenuItem value="week">Tuần này</MenuItem>
                                <MenuItem value="month">Tháng này</MenuItem>
                                <MenuItem value="quarter">Quý này</MenuItem>
                                <MenuItem value="year">Năm này</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            <ExportActions
                printRef={printRef}
                reportData={getCurrentReportData()}
                reportType={selectedReport}
            />

            <div ref={printRef}>
                {selectedReport === "financial" && renderFinancialReport()}
                {selectedReport === "apartment" && renderApartmentReport()}
                {selectedReport === "service-usage" &&
                    renderServiceUsageReport()}
                {selectedReport === "building-occupancy" &&
                    renderBuildingOccupancyReport()}
                {selectedReport === "payment-analytics" &&
                    renderPaymentAnalyticsReport()}
            </div>
        </Container>
    );
};

export default Reports;
