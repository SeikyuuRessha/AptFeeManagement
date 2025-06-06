"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Chip,
    Alert,
    Snackbar,
    Card,
    CardContent,
    LinearProgress,
    InputAdornment,
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MiscellaneousServices as ServiceIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import Grid from "@mui/material/GridLegacy";
import {
    getServices,
    createService,
    updateService,
    deleteService,
    Service,
} from "@/services/service";
import { getSubscriptions, Subscription } from "@/services/subscription";

interface ServiceWithStats extends Service {
    totalSubscriptions: number;
    activeSubscriptions: number;
}

const AdminServicesPage = () => {
    const [services, setServices] = useState<ServiceWithStats[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        unitPrice: "",
    });

    // Filter services based on search query
    const filteredServices = React.useMemo(() => {
        if (!searchQuery.trim()) return services;

        return services.filter(
            (service) =>
                service.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                service.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [services, searchQuery]);

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [servicesData, subscriptionsData] = await Promise.all([
                getServices(),
                getSubscriptions(),
            ]);

            // Calculate statistics for each service
            const servicesWithStats: ServiceWithStats[] = servicesData.map(
                (service) => {
                    const serviceSubscriptions = subscriptionsData.filter(
                        (sub) => sub.serviceId === service.id
                    );
                    const activeSubscriptions = serviceSubscriptions.filter(
                        (sub) => sub.status === "active"
                    );

                    return {
                        ...service,
                        totalSubscriptions: serviceSubscriptions.length,
                        activeSubscriptions: activeSubscriptions.length,
                    };
                }
            );

            setServices(servicesWithStats);
            setSubscriptions(subscriptionsData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Không thể tải dữ liệu"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form
    const handleOpenDialog = (service?: Service) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                description: service.description,
                unitPrice: service.unitPrice,
            });
        } else {
            setEditingService(null);
            setFormData({
                name: "",
                description: "",
                unitPrice: "",
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingService(null);
        setFormData({
            name: "",
            description: "",
            unitPrice: "",
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingService) {
                // Update service
                await updateService(editingService.id, formData);
                setSuccess("Cập nhật dịch vụ thành công");
            } else {
                // Create service
                await createService(formData);
                setSuccess("Tạo dịch vụ thành công");
            }

            handleCloseDialog();
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Thao tác thất bại");
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không?")) {
            try {
                await deleteService(serviceId);
                setSuccess("Xóa dịch vụ thành công");
                await fetchData();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Xóa thất bại");
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    // Summary statistics
    const totalServices = services.length;
    const totalSubscriptions = services.reduce(
        (sum, service) => sum + service.totalSubscriptions,
        0
    );
    const totalActiveSubscriptions = services.reduce(
        (sum, service) => sum + service.activeSubscriptions,
        0
    );

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý Dịch vụ
                </Typography>
                <LinearProgress />
                <Typography sx={{ mt: 2 }}>
                    Đang tải danh sách dịch vụ...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <Typography variant="h4" component="h1">
                    Quản lý Dịch vụ
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ backgroundColor: "#1976d2" }}
                >
                    Thêm Dịch vụ
                </Button>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: "background.paper" }}>
                <TextField
                    fullWidth
                    label="Tìm kiếm dịch vụ"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên dịch vụ hoặc mô tả..."
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "action.active" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <ServiceIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalServices}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Tổng Dịch vụ
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <ServiceIcon
                                    color="success"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalSubscriptions}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Tổng Đăng ký
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <ServiceIcon
                                    color="warning"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalActiveSubscriptions}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Đăng ký Hoạt động
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Services Table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                    Tên Dịch vụ
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                    Mô tả
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Đơn giá
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Tổng ĐK
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    ĐK Hoạt động
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Ngày tạo
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Thao tác
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredServices.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <Typography color="text.secondary">
                                            Không tìm thấy dịch vụ nào. Nhấp
                                            "Thêm Dịch vụ" để tạo mới.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredServices.map((service) => (
                                    <TableRow key={service.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {service.name}
                                        </TableCell>
                                        <TableCell sx={{ maxWidth: 200 }}>
                                            <Typography
                                                variant="body2"
                                                noWrap
                                                title={service.description}
                                            >
                                                {service.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {formatCurrency(
                                                parseFloat(service.unitPrice)
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    service.totalSubscriptions
                                                }
                                                size="small"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    service.activeSubscriptions
                                                }
                                                size="small"
                                                color="success"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {formatDate(service.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleOpenDialog(service)
                                                }
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(service.id)
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Tên dịch vụ"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Mô tả"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    description: e.target.value,
                                })
                            }
                            margin="normal"
                            required
                            multiline
                            rows={3}
                        />
                        <TextField
                            fullWidth
                            label="Đơn giá"
                            type="number"
                            value={formData.unitPrice}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    unitPrice: e.target.value,
                                })
                            }
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        ₫
                                    </InputAdornment>
                                ),
                                inputProps: { min: 0, step: 1000 },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !formData.name ||
                            !formData.description ||
                            !formData.unitPrice
                        }
                    >
                        {editingService ? "Cập nhật" : "Tạo mới"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbars */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!success}
                autoHideDuration={4000}
                onClose={() => setSuccess(null)}
            >
                <Alert severity="success" onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminServicesPage;
