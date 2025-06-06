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
    LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface BuildingData {
    id: string;
    name: string;
    address: string;
    totalApartments: number;
    occupiedApartments: number;
    vacantApartments: number;
    occupancyRate: number;
    totalRevenue: number;
    averageRent: number;
}

interface BuildingOccupancyReportProps {
    data: BuildingData[];
}

export const BuildingOccupancyReport: React.FC<
    BuildingOccupancyReportProps
> = ({ data }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Calculate overall statistics
    const totalApartments = data.reduce(
        (sum, building) => sum + building.totalApartments,
        0
    );
    const totalOccupied = data.reduce(
        (sum, building) => sum + building.occupiedApartments,
        0
    );
    const totalVacant = data.reduce(
        (sum, building) => sum + building.vacantApartments,
        0
    );
    const overallOccupancyRate =
        totalApartments > 0 ? (totalOccupied / totalApartments) * 100 : 0;

    const overallChartData = {
        labels: ["Đã thuê", "Trống"],
        datasets: [
            {
                data: [totalOccupied, totalVacant],
                backgroundColor: ["#4CAF50", "#FF9800"],
                borderColor: ["#4CAF50", "#FF9800"],
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
            },
            title: {
                display: true,
                text: "Phân bổ Lấp đầy Tổng thể",
            },
        },
    };

    const getOccupancyColor = (rate: number) => {
        if (rate >= 90) return "success";
        if (rate >= 70) return "warning";
        return "error";
    };

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            {" "}
            <Typography variant="h6" gutterBottom>
                Báo cáo Lấp đầy Tòa nhà
            </Typography>
            <Grid container spacing={3}>
                {/* Overall Summary */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            {" "}
                            <Typography variant="h6" gutterBottom>
                                Thống kê Tổng thể
                            </Typography>
                            <Typography
                                variant="h4"
                                color="primary"
                                gutterBottom
                            >
                                {overallOccupancyRate.toFixed(1)}%
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                Tỷ lệ Lấp đầy Tổng thể
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    Tổng Căn hộ: {totalApartments}
                                </Typography>
                                <Typography variant="body2">
                                    Đã thuê: {totalOccupied}
                                </Typography>
                                <Typography variant="body2">
                                    Trống: {totalVacant}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Overall Chart */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    height: 300,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Doughnut
                                    data={overallChartData}
                                    options={chartOptions}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Building Details Table */}
                <Grid item xs={12}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {" "}
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Tòa nhà
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        Địa chỉ
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Tổng Căn hộ
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Đã thuê
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Trống
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Tỷ lệ Lấp đầy
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
                                        Tiền thuê TB
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((building) => (
                                    <TableRow
                                        key={building.id}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {building.name}
                                        </TableCell>
                                        <TableCell>
                                            {building.address}
                                        </TableCell>
                                        <TableCell align="center">
                                            {building.totalApartments}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    building.occupiedApartments
                                                }
                                                color="success"
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {building.vacantApartments > 0 ? (
                                                <Chip
                                                    label={
                                                        building.vacantApartments
                                                    }
                                                    color="warning"
                                                    size="small"
                                                />
                                            ) : (
                                                "-"
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: "100%",
                                                        mr: 1,
                                                    }}
                                                >
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={
                                                            building.occupancyRate
                                                        }
                                                        color={getOccupancyColor(
                                                            building.occupancyRate
                                                        )}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ minWidth: 35 }}>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        {building.occupancyRate.toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {formatCurrency(
                                                building.totalRevenue
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(
                                                building.averageRent
                                            )}
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
