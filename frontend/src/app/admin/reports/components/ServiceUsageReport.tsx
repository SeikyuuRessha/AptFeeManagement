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
                label: "Đăng ký Hoạt động",
                data: data.map((service) => service.activeSubscriptions),
                backgroundColor: "rgba(76, 175, 80, 0.8)",
                borderColor: "rgba(76, 175, 80, 1)",
                borderWidth: 1,
            },
            {
                label: "Đăng ký Không hoạt động",
                data: data.map((service) => service.inactiveSubscriptions),
                backgroundColor: "rgba(158, 158, 158, 0.8)",
                borderColor: "rgba(158, 158, 158, 1)",
                borderWidth: 1,
            },
            {
                label: "Tổng Doanh thu (triệu VND)",
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
                text: "Tổng quan Sử dụng Dịch vụ & Doanh thu",
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
                    text: "Đăng ký",
                },
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Doanh thu (triệu VND)",
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            {" "}
            <Typography variant="h6" gutterBottom>
                Báo cáo Sử dụng Dịch vụ
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
                                            {" "}
                                            <Chip
                                                label={`${service.activeSubscriptions} Hoạt động`}
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                            {service.inactiveSubscriptions >
                                                0 && (
                                                <Chip
                                                    label={`${service.inactiveSubscriptions} Không hoạt động`}
                                                    color="default"
                                                    size="small"
                                                />
                                            )}
                                        </Box>{" "}
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Doanh thu:{" "}
                                            {formatCurrency(
                                                service.totalRevenue
                                            )}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Sử dụng TB:{" "}
                                            {service.averageUsage.toFixed(1)}{" "}
                                            đơn vị
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
                                    {" "}
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Dịch vụ
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Tổng Đăng ký
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Hoạt động
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Không hoạt động
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Tổng Doanh thu
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Sử dụng Trung bình
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
                                        </TableCell>{" "}
                                        <TableCell align="right">
                                            {service.averageUsage.toFixed(2)}{" "}
                                            đơn vị
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
