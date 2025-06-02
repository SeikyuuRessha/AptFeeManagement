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
                    Reports Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    View and analyze financial and apartment reports
                </Typography>
            </Box>

            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Report Type</InputLabel>
                            <Select
                                value={selectedReport}
                                label="Report Type"
                                onChange={handleReportChange}
                            >
                                <MenuItem value="financial">
                                    Financial Report
                                </MenuItem>
                                <MenuItem value="apartment">
                                    Apartment Report
                                </MenuItem>
                                <MenuItem value="service-usage">
                                    Service Usage Report
                                </MenuItem>
                                <MenuItem value="building-occupancy">
                                    Building Occupancy Report
                                </MenuItem>
                                <MenuItem value="payment-analytics">
                                    Payment Analytics Report
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Date Range</InputLabel>
                            <Select
                                value={dateRange}
                                label="Date Range"
                                onChange={handleDateRangeChange}
                            >
                                <MenuItem value="week">This Week</MenuItem>
                                <MenuItem value="month">This Month</MenuItem>
                                <MenuItem value="quarter">
                                    This Quarter
                                </MenuItem>
                                <MenuItem value="year">This Year</MenuItem>
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
