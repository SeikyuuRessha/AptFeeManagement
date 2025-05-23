// components/GrowthComparisonChart.tsx
import { Line } from "react-chartjs-2";
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

// Đăng ký các thành phần cần thiết
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
);

const GrowthComparisonChart = () => {
	const labels = [
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

	const data = {
		labels,
		datasets: [
			{
				label: "User Growth",
				data: [
					50, 80, 120, 150, 200, 220, 250, 300, 340, 400, 420, 500,
				],
				borderColor: "#3b82f6", // blue
				backgroundColor: "rgba(59, 130, 246, 0.2)",
				tension: 0.4,
			},
			{
				label: "Building Growth",
				data: [5, 10, 12, 15, 18, 25, 27, 30, 32, 36, 40, 45],
				borderColor: "#10b981", // green
				backgroundColor: "rgba(16, 185, 129, 0.2)",
				tension: 0.4,
			},
			{
				label: "Apartment Growth",
				data: [20, 25, 30, 40, 50, 55, 60, 70, 80, 90, 100, 120],
				borderColor: "#f59e0b", // yellow
				backgroundColor: "rgba(245, 158, 11, 0.2)",
				tension: 0.4,
			},
		],
	};

	const options = {
		responsive: true,
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Multi-Type Growth Over 12 Months",
			},
		},
	};

	return (
		<div className="bg-white p-4 rounded-lg shadow-lg">
			<Line data={data} options={options} />
		</div>
	);
};

export default GrowthComparisonChart;
