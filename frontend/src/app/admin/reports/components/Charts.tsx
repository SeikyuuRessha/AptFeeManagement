import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { FinancialData, ApartmentData } from "../hooks/useReportsData";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface ChartsProps {
    data: FinancialData | ApartmentData;
    reportType?: string;
}

export const Charts: React.FC<ChartsProps> = ({
    data,
    reportType = "financial",
}) => {
    // Check if data is FinancialData or ApartmentData
    const isFinancialData = reportType === "financial" && "revenue" in data;
    const isApartmentData = reportType === "apartment" && "occupancy" in data;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    if (isFinancialData) {
        const financialData = data as FinancialData;

        // Revenue Chart Data
        const revenueChartData = {
            labels: financialData.revenue.labels,
            datasets: [
                {
                    label: "Monthly Revenue",
                    data: financialData.revenue.monthly,
                    backgroundColor: "rgba(33, 150, 243, 0.8)",
                    borderColor: "rgba(33, 150, 243, 1)",
                    borderWidth: 1,
                },
            ],
        };
        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Monthly Revenue
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Bar
                                    data={revenueChartData}
                                    options={chartOptions}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

    if (isApartmentData) {
        const apartmentData = data as ApartmentData;

        // Occupancy Chart Data
        const occupancyChartData = {
            labels: ["Occupied", "Vacant"],
            datasets: [
                {
                    data: [
                        apartmentData.occupancy.occupied,
                        apartmentData.occupancy.vacant,
                    ],
                    backgroundColor: [
                        "rgba(76, 175, 80, 0.8)",
                        "rgba(255, 152, 0, 0.8)",
                    ],
                    borderColor: [
                        "rgba(76, 175, 80, 1)",
                        "rgba(255, 152, 0, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        };

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Occupancy Status
                            </Typography>
                            <Box sx={{ height: 300 }}>
                                <Pie
                                    data={occupancyChartData}
                                    options={{ responsive: true }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );
    }

    return (
        <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
                No chart data available
            </Typography>
        </Box>
    );
};
