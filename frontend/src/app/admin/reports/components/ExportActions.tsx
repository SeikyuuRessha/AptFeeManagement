import React, { useRef } from "react";
import {
    Card,
    CardContent,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Divider,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { PictureAsPdf, Download, Assessment } from "@mui/icons-material";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

import {
    FinancialData,
    ApartmentData,
    ServiceUsageData,
    BuildingOccupancyData,
    PaymentAnalyticsData,
} from "../hooks/useReportsData";

interface ExportActionsProps {
    printRef: React.RefObject<HTMLDivElement | null>;
    reportData:
        | FinancialData
        | ApartmentData
        | ServiceUsageData[]
        | BuildingOccupancyData[]
        | PaymentAnalyticsData[]
        | null;
    reportType: string;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
    printRef,
    reportData,
    reportType,
}) => {
    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `${reportType}-Report-${
            new Date().toISOString().split("T")[0]
        }`,
    });
    const exportToPDF = async () => {
        if (!printRef.current) return;

        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const fileName = `${reportType}-report-${
                new Date().toISOString().split("T")[0]
            }.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error("Error exporting PDF:", error);
        }
    };

    const exportToCSV = () => {
        if (!reportData) return;

        const currentDate = new Date().toISOString().split("T")[0];
        let csvContent = `${reportType} Report,${currentDate}\n`;

        if (reportType === "financial" && "revenue" in reportData) {
            csvContent += "Type,Amount\n";
            csvContent += `Total Revenue,${
                (reportData as any).totalRevenue || 0
            }\n`;
            csvContent += `Total Expenses,${
                (reportData as any).totalExpenses || 0
            }\n`;
        }

        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `${reportType}-report-${currentDate}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Export Actions
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                        variant="contained"
                        startIcon={<PictureAsPdf />}
                        onClick={exportToPDF}
                        color="primary"
                    >
                        Export PDF
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={exportToCSV}
                        color="primary"
                    >
                        Export CSV
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<Assessment />}
                        onClick={() => handlePrint()}
                        color="primary"
                    >
                        Print
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};
