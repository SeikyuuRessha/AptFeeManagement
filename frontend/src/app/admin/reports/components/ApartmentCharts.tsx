import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Bar, Doughnut } from "react-chartjs-2";
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
import { ApartmentData } from "../hooks/useReportsData";

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

interface ApartmentChartsProps {
    data: ApartmentData;
}

export const ApartmentCharts: React.FC<ApartmentChartsProps> = ({ data }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Occupancy Chart Data
    const occupancyChartData = {
        labels: ["Occupied", "Vacant"],
        datasets: [
            {
                data: [data.occupancy.occupied, data.occupancy.vacant],
                backgroundColor: ["#4CAF50", "#FF9800"],
                borderColor: ["#4CAF50", "#FF9800"],
                borderWidth: 2,
            },
        ],
    };

    // Rent Distribution Chart Data
    const rentChartData = {
        labels: data.rentDistribution.labels,
        datasets: [
            {
                label: "Number of Apartments",
                data: data.rentDistribution.data,
                backgroundColor: [
                    "rgba(76, 175, 80, 0.8)",
                    "rgba(33, 150, 243, 0.8)",
                    "rgba(255, 152, 0, 0.8)",
                    "rgba(156, 39, 176, 0.8)",
                ],
                borderColor: [
                    "rgba(76, 175, 80, 1)",
                    "rgba(33, 150, 243, 1)",
                    "rgba(255, 152, 0, 1)",
                    "rgba(156, 39, 176, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Building Distribution Chart (based on apartment details)
    const buildingDistribution = data.apartmentDetails.reduce(
        (acc, apartment) => {
            const building = apartment.buildingName;
            acc[building] = (acc[building] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const buildingChartData = {
        labels: Object.keys(buildingDistribution),
        datasets: [
            {
                label: "Apartments per Building",
                data: Object.values(buildingDistribution),
                backgroundColor: "rgba(63, 81, 181, 0.8)",
                borderColor: "rgba(63, 81, 181, 1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return (
        <Grid container spacing={3}>
            {/* Occupancy Status */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Occupancy Status
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Doughnut
                                data={occupancyChartData}
                                options={doughnutOptions}
                            />
                        </Box>
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Occupancy Rate:{" "}
                                {data.occupancy.occupancyRate.toFixed(1)}%
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>{" "}
            </Grid>

            {/* Rent Distribution */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Rent Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar data={rentChartData} options={chartOptions} />
                        </Box>
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Average Rent:{" "}
                                {formatCurrency(
                                    data.rentDistribution.averageRent
                                )}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Building Distribution */}
            <Grid item xs={12} md={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Apartments per Building
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <Bar
                                data={buildingChartData}
                                options={chartOptions}
                            />
                        </Box>
                        <Box sx={{ mt: 2, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                Total Buildings:{" "}
                                {data.statistics.totalBuildings}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
