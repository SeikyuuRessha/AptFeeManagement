import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { TrendingUp, MonetizationOn, Receipt } from "@mui/icons-material";
import { FinancialData } from "../hooks/useReportsData";

interface FinancialOverviewProps {
    data: FinancialData;
}

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    color: string;
    trend?: string;
}> = ({ title, value, icon, color, trend }) => (
    <Card sx={{ height: "100%" }}>
        <CardContent>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
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
                        <Typography variant="body2" sx={{ color }}>
                            {trend}
                        </Typography>
                    )}
                </Box>
                <Box sx={{ color }}>{icon}</Box>
            </Box>
        </CardContent>
    </Card>
);

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
    data,
}) => {
    const formatCurrency = (amount: number) => {
        // Ensure amount is a valid number
        const numAmount = Number(amount) || 0;

        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(numAmount);
    };

    const totalDebt = data.debt.reduce((sum, debt) => sum + debt.amount, 0);

    return (
        <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(data.totalRevenue)}
                    icon={<MonetizationOn fontSize="large" />}
                    color="#4caf50"
                    trend={`${
                        data.monthlyGrowth > 0 ? "+" : ""
                    }${data.monthlyGrowth.toFixed(1)}% from last month`}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Outstanding Debt"
                    value={formatCurrency(totalDebt)}
                    icon={<Receipt fontSize="large" />}
                    color="#f44336"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Monthly Growth"
                    value={`${data.monthlyGrowth.toFixed(1)}%`}
                    icon={<TrendingUp fontSize="large" />}
                    color={data.monthlyGrowth >= 0 ? "#4caf50" : "#f44336"}
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Debt Cases"
                    value={data.debt.length.toString()}
                    icon={<Receipt fontSize="large" />}
                    color="#ff9800"
                />
            </Grid>
        </Grid>
    );
};
