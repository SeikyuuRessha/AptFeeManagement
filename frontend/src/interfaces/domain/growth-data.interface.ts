/**
 * Growth data interfaces
 * Follows Interface Segregation Principle by separating concerns
 */
export interface IGrowthMetrics {
    users: number[];
    buildings: number[];
    apartments: number[];
    revenue: number[];
}

export interface IChartDataset {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
    yAxisID?: string;
}

export interface IChartData {
    labels: string[];
    datasets: IChartDataset[];
}

export interface IChartOptions {
    responsive: boolean;
    interaction: any;
    scales: any;
    plugins: any;
}

export interface IGrowthDataService {
    fetchGrowthMetrics(): Promise<IGrowthMetrics>;
    transformToChartData(metrics: IGrowthMetrics): IChartData;
    getChartOptions(): IChartOptions;
}
