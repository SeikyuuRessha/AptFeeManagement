import React from "react";
import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card,
    CardContent,
    Box,
    Chip,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface ServiceUsageData {
    serviceName: string;
    totalSubscriptions: number;
    totalRevenue: number;
    averageUsage: number;
    activeSubscriptions: number;
    inactiveSubscriptions: number;
}

interface ServiceUsageReportProps {
    data: ServiceUsageData[];
}

export const ServiceUsageReport: React.FC<ServiceUsageReportProps> = ({
    data,
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate summary statistics
    const totalServices = data.length;
    const totalActiveSubscriptions = data.reduce(
        (sum, service) => sum + service.activeSubscriptions,
        0
    );
    const totalInactiveSubscriptions = data.reduce(
        (sum, service) => sum + service.inactiveSubscriptions,
        0
    );
    const totalRevenue = data.reduce(
        (sum, service) => sum + service.totalRevenue,
        0
    );
    const averageRevenue = totalServices > 0 ? totalRevenue / totalServices : 0;

    const chartData = {
        labels: data.map((service) => service.serviceName),
        datasets: [
            {
                label: "Active Subscriptions",
                data: data.map((service) => service.activeSubscriptions),
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                borderColor: "rgba(76, 175, 80, 1)",
                borderWidth: 1,
            },
            {
                label: "Inactive Subscriptions",
                data: data.map((service) => service.inactiveSubscriptions),
                backgroundColor: "rgba(158, 158, 158, 0.8)",
                borderColor: "rgba(158, 158, 158, 1)",
                borderWidth: 1,
            },
            {
                label: "Total Revenue (millions VND)",
                data: data.map((service) => service.totalRevenue / 1000000),
                backgroundColor: "rgba(54, 162, 235, 0.8)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
                yAxisID: "y1",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: "index" as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Service Usage & Revenue Overview",
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.dataset.label || "";
                        if (label.includes("Revenue")) {
                            return `${label}: ${formatCurrency(
                                context.parsed.y * 1000000
                            )}`;
                        }
                        return `${label}: ${context.parsed.y}`;
                    },
                },
            },
        },
        scales: {
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Subscriptions",
                },
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Revenue (millions VND)",
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
                Service Usage Report
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        {data.map((service) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={service.serviceName}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                        >
                                            {service.serviceName}
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Chip
                                                label={`${service.activeSubscriptions} Active`}
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            {service.inactiveSubscriptions >
                                                0 && (
                                                <Chip
                                                    label={`${service.inactiveSubscriptions} Inactive`}
                                                    color="default"
                                                    size="small"
                                                />
                                            )}
                                        </Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Revenue:{" "}
                                            {formatCurrency(
                                                service.totalRevenue
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Avg Usage:{" "}
                                            {service.averageUsage.toFixed(1)}{" "}
                                            units
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* Chart */}
                <Grid item xs={12} md={8}>
                    <Box sx={{ height: 400 }}>
                        <Bar data={chartData} options={chartOptions} />
                    </Box>
                </Grid>

                {/* Detailed Table */}
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Service
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Total Subscriptions
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Active
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Inactive
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Total Revenue
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Average Usage
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((service) => (
                                    <TableRow
                                        key={service.serviceName}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {service.serviceName}
                                        </TableCell>
                                        <TableCell align="center">
                                            {service.totalSubscriptions}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    service.activeSubscriptions
                                                }
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {service.inactiveSubscriptions >
                                            0 ? (
                                                <Chip
                                                    label={
                                                        service.inactiveSubscriptions
                                                    }
                                                    color="default"
                                                    size="small"
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {formatCurrency(
                                                service.totalRevenue
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {service.averageUsage.toFixed(2)}{" "}
                                            units
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Paper>
    );
};
