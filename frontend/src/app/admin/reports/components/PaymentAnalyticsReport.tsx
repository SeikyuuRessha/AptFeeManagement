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
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface PaymentData {
    month: string;
    totalPayments: number;
    totalAmount: number;
    averagePayment: number;
    onTimePayments: number;
    latePayments: number;
    paymentMethods: {
        [key: string]: number;
    };
}

interface PaymentAnalyticsReportProps {
    data: PaymentData[];
}

export const PaymentAnalyticsReport: React.FC<PaymentAnalyticsReportProps> = ({
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

    // Calculate totals
    const totalPayments = data.reduce(
        (sum, month) => sum + month.totalPayments,
        0
    );
    const totalAmount = data.reduce((sum, month) => sum + month.totalAmount, 0);
    const totalOnTime = data.reduce(
        (sum, month) => sum + month.onTimePayments,
        0
    );
    const totalLate = data.reduce((sum, month) => sum + month.latePayments, 0);
    const onTimeRate =
        totalPayments > 0 ? (totalOnTime / totalPayments) * 100 : 0;

    const chartData = {
        labels: data.map((month) => month.month),
        datasets: [
            {
                label: "Total Amount (millions VND)",
                data: data.map((month) => month.totalAmount / 1000000),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1,
                yAxisID: "y",
            },
            {
                label: "Number of Payments",
                data: data.map((month) => month.totalPayments),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                tension: 0.1,
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
            title: {
                display: true,
                text: "Payment Trends Over Time",
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                type: "linear" as const,
                display: true,
                position: "left" as const,
                title: {
                    display: true,
                    text: "Amount (millions VND)",
                },
            },
            y1: {
                type: "linear" as const,
                display: true,
                position: "right" as const,
                title: {
                    display: true,
                    text: "Number of Payments",
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
                Payment Analytics Report
            </Typography>

            <Grid container spacing={3}>
                {/* Summary Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                    >
                                        Total Payments
                                    </Typography>
                                    <Typography variant="h4" color="primary">
                                        {totalPayments}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        All time payments
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                    >
                                        Total Amount
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="success.main"
                                    >
                                        {formatCurrency(totalAmount)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Revenue collected
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                    >
                                        On-Time Rate
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={
                                            onTimeRate >= 80
                                                ? "success.main"
                                                : "warning.main"
                                        }
                                    >
                                        {onTimeRate.toFixed(1)}%
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {totalOnTime} on time, {totalLate} late
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        gutterBottom
                                    >
                                        Average Payment
                                    </Typography>
                                    <Typography variant="h5" color="info.main">
                                        {formatCurrency(
                                            totalAmount / totalPayments || 0
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Per transaction
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>

                {/* Trend Chart */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ height: 400 }}>
                                <Line data={chartData} options={chartOptions} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Monthly Details Table */}
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Month
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Total Payments
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Total Amount
                                    </TableCell>
                                    <TableCell
                                        align="right"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Average Payment
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        On Time
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Late
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        On-Time Rate
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((month) => {
                                    const monthOnTimeRate =
                                        month.totalPayments > 0
                                            ? (month.onTimePayments /
                                                  month.totalPayments) *
                                              100
                                            : 0;

                                    return (
                                        <TableRow
                                            key={month.month}
                                            sx={{
                                                "&:hover": {
                                                    backgroundColor:
                                                        "action.hover",
                                                },
                                            }}
                                        >
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {month.month}
                                            </TableCell>
                                            <TableCell align="center">
                                                {month.totalPayments}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{ fontWeight: 500 }}
                                            >
                                                {formatCurrency(
                                                    month.totalAmount
                                                )}
                                            </TableCell>
                                            <TableCell align="right">
                                                {formatCurrency(
                                                    month.averagePayment
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={month.onTimePayments}
                                                    color="success"
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                {month.latePayments > 0 ? (
                                                    <Chip
                                                        label={
                                                            month.latePayments
                                                        }
                                                        color="error"
                                                        size="small"
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={`${monthOnTimeRate.toFixed(
                                                        1
                                                    )}%`}
                                                    color={
                                                        monthOnTimeRate >= 80
                                                            ? "success"
                                                            : "warning"
                                                    }
                                                    size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Paper>
    );
};
