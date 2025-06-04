import {
    IGrowthDataService,
    IGrowthMetrics,
    IChartData,
    IChartOptions,
    IChartDataset,
} from "../../interfaces/domain/growth-data.interface";
import { IUserRepository } from "../../interfaces/repositories/user.repository.interface";
import {
    IBuildingRepository,
    IApartmentRepository,
} from "../../interfaces/repositories/building.repository.interface";
import { IPaymentRepository } from "../../interfaces/repositories/payment.repository.interface";
import { AppError, NetworkError } from "../../core/error-handling";

/**
 * Growth Data Service Implementation
 * Follows Single Responsibility Principle by handling only growth data operations
 * Follows Dependency Inversion Principle by depending on abstractions
 */
export class GrowthDataService implements IGrowthDataService {
    private readonly monthLabels = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly buildingRepository: IBuildingRepository,
        private readonly apartmentRepository: IApartmentRepository,
        private readonly paymentRepository: IPaymentRepository
    ) {}

    async fetchGrowthMetrics(): Promise<IGrowthMetrics> {
        try {
            // Fetch all data in parallel for better performance
            const [users, buildings, apartments, payments] = await Promise.all([
                this.userRepository.findAll(),
                this.buildingRepository.findAll(),
                this.apartmentRepository.findAll(),
                this.paymentRepository.findAll(),
            ]);

            // Calculate monthly growth data
            const monthlyUserGrowth = this.calculateMonthlyGrowth(
                users,
                "createdAt"
            );
            const monthlyBuildingGrowth = this.calculateMonthlyGrowth(
                buildings,
                "createdAt"
            );
            const monthlyApartmentGrowth = this.calculateMonthlyGrowth(
                apartments,
                "createdAt"
            );
            const monthlyRevenue = this.calculateMonthlyRevenue(payments);

            // Convert to cumulative for better visualization
            return {
                users: this.calculateCumulative(monthlyUserGrowth),
                buildings: this.calculateCumulative(monthlyBuildingGrowth),
                apartments: this.calculateCumulative(monthlyApartmentGrowth),
                revenue: monthlyRevenue.map((amount) => amount / 1000000), // Convert to millions
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new NetworkError(
                `Failed to fetch growth metrics: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    transformToChartData(metrics: IGrowthMetrics): IChartData {
        const datasets: IChartDataset[] = [
            {
                label: "Tổng số người dùng",
                data: metrics.users,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4,
                yAxisID: "y",
            },
            {
                label: "Tổng số tòa nhà",
                data: metrics.buildings,
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.2)",
                tension: 0.4,
                yAxisID: "y",
            },
            {
                label: "Tổng số căn hộ",
                data: metrics.apartments,
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.2)",
                tension: 0.4,
                yAxisID: "y",
            },
            {
                label: "Doanh thu (triệu VND)",
                data: metrics.revenue,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                tension: 0.4,
                yAxisID: "y1",
            },
        ];

        return {
            labels: this.monthLabels,
            datasets,
        };
    }

    getChartOptions(): IChartOptions {
        return {
            responsive: true,
            interaction: {
                mode: "index" as const,
                intersect: false,
            },
            scales: {
                y: {
                    type: "linear" as const,
                    display: true,
                    position: "left" as const,
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Số lượng",
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
            plugins: {
                legend: {
                    position: "top" as const,
                },
                title: {
                    display: true,
                    text: "Biểu đồ tăng trưởng theo thời gian thực",
                },
                tooltip: {
                    callbacks: {
                        label: function (context: any) {
                            const label = context.dataset.label || "";
                            const value = context.parsed.y;

                            if (label.includes("Doanh thu")) {
                                return `${label}: ${value.toFixed(
                                    2
                                )} triệu VND`;
                            }
                            return `${label}: ${value}`;
                        },
                    },
                },
            },
        };
    }

    private calculateMonthlyGrowth(items: any[], dateField: string): number[] {
        const monthlyGrowth = new Array(12).fill(0);

        items.forEach((item) => {
            const month = new Date(item[dateField]).getMonth();
            monthlyGrowth[month]++;
        });

        return monthlyGrowth;
    }

    private calculateMonthlyRevenue(payments: any[]): number[] {
        const monthlyRevenue = new Array(12).fill(0);

        payments.forEach((payment) => {
            const month = new Date(payment.paymentDate).getMonth();
            monthlyRevenue[month] += Number(payment.amount) || 0;
        });

        return monthlyRevenue;
    }

    private calculateCumulative(monthlyData: number[]): number[] {
        return monthlyData.reduce(
            (acc: number[], curr: number, index: number) => {
                acc[index] = (acc[index - 1] || 0) + curr;
                return acc;
            },
            []
        );
    }
}
