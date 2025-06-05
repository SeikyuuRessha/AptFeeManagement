import { useState, useEffect, useCallback } from "react";
import {
    IGrowthDataService,
    IChartData,
    IChartOptions,
} from "../interfaces/domain/growth-data.interface";
import { AppBootstrap } from "../core/app-bootstrap";
import { SERVICE_TOKENS } from "../core/di-container";
import { AppError, NetworkError } from "../core/error-handling";

/**
 * Custom hook for growth chart data
 * Follows Single Responsibility Principle by handling only chart state
 * Uses Dependency Injection for loose coupling
 */
export const useGrowthChart = () => {
    const [chartData, setChartData] = useState<IChartData | null>(null);
    const [chartOptions, setChartOptions] = useState<IChartOptions | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<AppError | null>(null);

    // Get service from DI container
    const service = AppBootstrap.getService<IGrowthDataService>(
        SERVICE_TOKENS.GROWTH_DATA_SERVICE
    );

    const fetchChartData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const metrics = await service.fetchGrowthMetrics();
            const transformedData = service.transformToChartData(metrics);
            const options = service.getChartOptions();

            setChartData(transformedData);
            setChartOptions(options);
        } catch (err) {
            const appError =
                err instanceof AppError
                    ? err
                    : new NetworkError("Không thể tải dữ liệu biểu đồ");
            setError(appError);
            console.error("Error fetching growth data:", err);
        } finally {
            setLoading(false);
        }
    }, [service]);

    const refreshData = useCallback(() => {
        fetchChartData();
    }, [fetchChartData]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    return {
        chartData,
        chartOptions,
        loading,
        error,
        refreshData,
        clearError: () => setError(null),
    };
};
