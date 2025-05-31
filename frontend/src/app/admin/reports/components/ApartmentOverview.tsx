import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    LinearProgress,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Home,
    TrendingUp,
    TrendingDown,
    Business,
    MonetizationOn,
    Warning,
    CheckCircle,
} from "@mui/icons-material";
import { ApartmentData } from "../hooks/useReportsData";

interface ApartmentOverviewProps {
    data: ApartmentData;
}

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
    progress?: number;
}> = ({ title, value, icon, color, trend, progress }) => (
    <Card sx={{ height: "100%" }}>
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
            >
                <Box>
                    <Typography
                        color="textSecondary"
                        gutterBottom
                        variant="body2"
                    >
                        {title}
                    </Typography>
                    <Typography variant="h4" component="div">
                        {value}
                    </Typography>
                    {trend && (
                        <Typography variant="body2" sx={{ color, mt: 1 }}>
                            {trend}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ color }}>{icon}</Box>
            </Box>
            {progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: "rgba(0, 0, 0, 0.1)",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: color,
                            },
                        }}
                    />
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ mt: 1, display: "block" }}
                    >
                        {progress.toFixed(1)}% occupancy rate
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);

export const ApartmentOverview: React.FC<ApartmentOverviewProps> = ({
    data,
}) => {
    const formatCurrency = (amount: number) => {
        const numAmount = Number(amount) || 0;
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case "increasing":
                return <TrendingUp />;
            case "decreasing":
                return <TrendingDown />;
            default:
                return <CheckCircle />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case "increasing":
                return "#f44336"; // Red for increasing vacancy
            case "decreasing":
                return "#4caf50"; // Green for decreasing vacancy
            default:
                return "#ff9800"; // Orange for stable
        }
    };

    const getTrendText = (trend: string) => {
        switch (trend) {
            case "increasing":
                return "Vacancy increasing";
            case "decreasing":
                return "Vacancy decreasing";
            default:
                return "Vacancy stable";
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Apartments"
                        value={data.occupancy.total.toString()}
                        icon={<Home fontSize="large" />}
                        color="#2196f3"
                        trend={`${data.statistics.totalBuildings} buildings`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Occupancy Rate"
                        value={`${data.occupancy.occupancyRate.toFixed(1)}%`}
                        icon={<Business fontSize="large" />}
                        color={
                            data.occupancy.occupancyRate >= 85
                                ? "#4caf50"
                                : data.occupancy.occupancyRate >= 70
                                ? "#ff9800"
                                : "#f44336"
                        }
                        trend={`${data.occupancy.occupied} occupied, ${data.occupancy.vacant} vacant`}
                        progress={data.occupancy.occupancyRate}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Monthly Revenue"
                        value={formatCurrency(
                            data.statistics.totalMonthlyRevenue
                        )}
                        icon={<MonetizationOn fontSize="large" />}
                        color="#4caf50"
                        trend={`Avg: ${formatCurrency(
                            data.rentDistribution.averageRent
                        )} per unit`}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Revenue Loss"
                        value={formatCurrency(
                            data.statistics.potentialRevenueLoss
                        )}
                        icon={<Warning fontSize="large" />}
                        color="#f44336"
                        trend={getTrendText(data.statistics.vacancyTrend)}
                    />
                </Grid>
            </Grid>

            {/* Additional Statistics */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Property Statistics
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Buildings
                                    </Typography>
                                    <Chip
                                        label={data.statistics.totalBuildings}
                                        color="primary"
                                        size="small"
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Avg Units per Building
                                    </Typography>
                                    <Chip
                                        label={data.statistics.averageApartmentsPerBuilding.toFixed(
                                            1
                                        )}
                                        color="secondary"
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Vacancy Trend
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    p: 2,
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    borderRadius: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        color: getTrendColor(
                                            data.statistics.vacancyTrend
                                        ),
                                    }}
                                >
                                    {getTrendIcon(data.statistics.vacancyTrend)}
                                </Box>
                                <Box>
                                    <Typography
                                        variant="body1"
                                        fontWeight="bold"
                                    >
                                        {getTrendText(
                                            data.statistics.vacancyTrend
                                        )}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        Current vacancy rate:{" "}
                                        {(
                                            (data.occupancy.vacant /
                                                data.occupancy.total) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
