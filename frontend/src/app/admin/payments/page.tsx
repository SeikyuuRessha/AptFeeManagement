"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    AttachMoney as MoneyIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    Error as FailedIcon,
    Receipt as ReceiptIcon,
    Search as SearchIcon,
} from "@mui/icons-material";

import { getPayments, Payment } from "@/services/payment";

// Extended interface for payments with additional details
interface PaymentWithDetails extends Payment {
    // Các field bổ sung sẽ được lấy từ quan hệ với Invoice
    apartmentInfo?: string;
    invoiceInfo?: string;
}

const PAYMENT_STATUS = [
    {
        value: "PENDING",
        label: "Chờ xử lý",
        color: "warning" as const,
        icon: PendingIcon,
    },
    {
        value: "COMPLETED",
        label: "Hoàn thành",
        color: "success" as const,
        icon: CompletedIcon,
    },
    {
        value: "FAILED",
        label: "Thất bại",
        color: "error" as const,
        icon: FailedIcon,
    },
];

function PaymentsManagement() {
    // State for data
    const [payments, setPayments] = useState<PaymentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching payments...");
            const paymentsData = await getPayments();
            console.log("Payments data received:", paymentsData);

            // Map payments với thông tin cơ bản
            const paymentsWithDetails: PaymentWithDetails[] = paymentsData.map(
                (payment) => ({
                    ...payment,
                    // Hiển thị invoiceId là thông tin chính
                    invoiceInfo: payment.invoiceId,
                    apartmentInfo: "N/A", // Sẽ cần join với Invoice -> Apartment nếu muốn hiển thị
                })
            );

            console.log("Payments with details:", paymentsWithDetails);
            setPayments(paymentsWithDetails);
        } catch (err) {
            console.error("Error fetching payments:", err);
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusInfo = (status: string) => {
        return (
            PAYMENT_STATUS.find((option) => option.value === status) ||
            PAYMENT_STATUS[0]
        );
    };

    // Filter payments based on search and filters
    const filteredPayments = payments.filter((payment) => {
        const matchesSearch =
            payment.invoiceId
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            payment.id?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || payment.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Calculate summary statistics
    const totalPayments = payments.length;
    const completedPayments = payments.filter(
        (p) => p.status === "COMPLETED"
    ).length;
    const pendingPayments = payments.filter(
        (p) => p.status === "PENDING"
    ).length;
    const totalRevenue = payments
        .filter((p) => p.status === "COMPLETED")
        .reduce(
            (sum, p) =>
                sum +
                (typeof p.amount === "number"
                    ? p.amount
                    : parseFloat(p.amount) || 0),
            0
        );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Quản lý thanh toán
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    Xem và theo dõi các giao dịch thanh toán của cư dân
                </Typography>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <ReceiptIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#2196f3",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Tổng giao dịch
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {totalPayments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CompletedIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#4caf50",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Đã hoàn thành
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {completedPayments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <PendingIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#ff9800",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Chờ xử lý
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {pendingPayments}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <MoneyIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#4caf50",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Tổng thu
                                    </Typography>
                                    <Typography variant="h5" component="div">
                                        {formatCurrency(totalRevenue)}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filter Section */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Tìm kiếm và lọc
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                placeholder="Tìm kiếm theo mã thanh toán, mã hóa đơn..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={statusFilter}
                                    label="Trạng thái"
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >
                                    <MenuItem value="all">
                                        Tất cả trạng thái
                                    </MenuItem>
                                    {PAYMENT_STATUS.map((status) => (
                                        <MenuItem
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Danh sách giao dịch ({filteredPayments.length})
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã thanh toán</TableCell>
                                    <TableCell>Mã hóa đơn</TableCell>
                                    <TableCell>Số tiền</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Ngày thanh toán</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="text.secondary">
                                                Không có giao dịch nào
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => {
                                        const statusInfo = getStatusInfo(
                                            payment.status
                                        );
                                        const StatusIcon = statusInfo.icon;
                                        const paymentAmount =
                                            typeof payment.amount === "number"
                                                ? payment.amount
                                                : parseFloat(payment.amount) ||
                                                  0;

                                        return (
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    {payment.id.substring(0, 8)}
                                                    ...
                                                </TableCell>
                                                <TableCell>
                                                    {payment.invoiceId.substring(
                                                        0,
                                                        8
                                                    )}
                                                    ...
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight="bold"
                                                    >
                                                        {formatCurrency(
                                                            paymentAmount
                                                        )}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        icon={<StatusIcon />}
                                                        label={statusInfo.label}
                                                        color={statusInfo.color}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        payment.paymentDate
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        payment.createdAt
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Box>
    );
}

export default PaymentsManagement;
