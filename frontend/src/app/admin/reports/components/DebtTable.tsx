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
    Chip,
} from "@mui/material";
interface DebtItem {
    id: string;
    resident: string;
    amount: number;
    months: number;
    apartment: string;
}

interface DebtTableProps {
    data: DebtItem[];
}

export const DebtTable: React.FC<DebtTableProps> = ({ data }) => {
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

    const getDebtSeverity = (months: number) => {
        if (months <= 1) return { color: "warning" as const, label: "Recent" };
        if (months <= 3) return { color: "error" as const, label: "Overdue" };
        return { color: "error" as const, label: "Critical" };
    };

    return (
        <Paper sx={{ mt: 3, width: "100%" }}>
            <Typography variant="h6" sx={{ p: 2 }}>
                Outstanding Debts
            </Typography>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{ minWidth: 180, fontWeight: "bold" }}
                            >
                                Resident
                            </TableCell>
                            <TableCell
                                sx={{ minWidth: 120, fontWeight: "bold" }}
                            >
                                Apartment
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ minWidth: 140, fontWeight: "bold" }}
                            >
                                Amount
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ minWidth: 120, fontWeight: "bold" }}
                            >
                                Overdue (Months)
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ minWidth: 100, fontWeight: "bold" }}
                            >
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={5}
                                    align="center"
                                    sx={{ py: 4, color: "text.secondary" }}
                                >
                                    No outstanding debts
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((debt) => {
                                const severity = getDebtSeverity(debt.months);
                                return (
                                    <TableRow
                                        key={debt.id}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "action.hover",
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {debt.resident}
                                        </TableCell>
                                        <TableCell>{debt.apartment}</TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {formatCurrency(debt.amount)}
                                        </TableCell>
                                        <TableCell align="center">
                                            {debt.months}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={severity.label}
                                                color={severity.color}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
