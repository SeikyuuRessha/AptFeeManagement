// app/admin/components/GrowthComparisonChart/ChartContainer.tsx
"use client";

import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import GrowthComparisonChart from "./index";

/**
 * Chart Container with Error Boundary
 * Demonstrates proper error handling integration
 */
const ChartContainer: React.FC = () => {
    return (
        <ErrorBoundary>
            <GrowthComparisonChart />
        </ErrorBoundary>
    );
};

export default ChartContainer;
