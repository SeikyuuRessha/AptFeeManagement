// components/GrowthComparisonChart.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import { CircularProgress, Box, Alert } from "@mui/material";
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
import { useGrowthChart } from "@/hooks/useGrowthChart";
import { AppError } from "@/core/error-handling";

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const GrowthComparisonChart: React.FC = () => {
    const { chartData, chartOptions, loading, error } = useGrowthChart();

    // Loading state
    if (loading) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center justify-center min-h-[400px]">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                >
                    <CircularProgress />
                    <span>Đang tải dữ liệu biểu đồ...</span>
                </Box>
            </div>
        );
    }

    // Error state with proper error type handling
    if (error) {
        const errorMessage =
            error instanceof AppError
                ? error.message
                : "Đã xảy ra lỗi không xác định";

        return (
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <Alert severity="error">{errorMessage}</Alert>
            </div>
        );
    }

    // No data state
    if (!chartData || !chartOptions) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <Alert severity="info">Không có dữ liệu để hiển thị</Alert>
            </div>
        );
    }

    // Main chart render
    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <Line data={chartData} options={chartOptions} />
        </div>
    );
};

export default GrowthComparisonChart;
