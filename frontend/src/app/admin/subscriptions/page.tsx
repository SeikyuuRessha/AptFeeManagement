"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Chip,
    Alert,
    CircularProgress,
    Tooltip,
    Fab,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Subscriptions as SubscriptionsIcon,
    TrendingUp as TrendingUpIcon,
    MonetizationOn as MoneyIcon,
    Assignment as AssignmentIcon,
    CheckCircle as ActiveIcon,
    Cancel as InactiveIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import {
    getSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    Subscription,
} from "@/services/subscription";
import { getServices, Service } from "@/services/service";
import {
    getApartments,
    getBuildings,
    Apartment,
    Building,
} from "@/services/building";

// Extended interface for subscriptions with additional stats
interface SubscriptionWithDetails extends Subscription {
    serviceName: string;
    servicePrice: string;
    apartmentNumber: number;
    buildingName: string;
    totalRevenue: number;
}

const FREQUENCY_OPTIONS = [
    { value: "monthly", label: "Hàng tháng" },
    { value: "quarterly", label: "Hàng quý" },
    { value: "yearly", label: "Hàng năm" },
];

const STATUS_OPTIONS = [
    { value: "active", label: "Hoạt động", color: "success" as const },
    { value: "inactive", label: "Tạm dừng", color: "error" as const },
    { value: "pending", label: "Chờ duyệt", color: "warning" as const },
];

export default function SubscriptionsManagement() {
    // State for data
    const [subscriptions, setSubscriptions] = useState<
        SubscriptionWithDetails[]
    >([]);
    const [services, setServices] = useState<Service[]>([]);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingSubscription, setEditingSubscription] =
        useState<Subscription | null>(null);
    const [formData, setFormData] = useState({
        apartmentId: "",
        serviceId: "",
        frequency: "monthly",
        nextBillingDate: new Date(),
        status: "active",
    });

    // Filter subscriptions based on search query
    const filteredSubscriptions = useMemo(() => {
        if (!searchQuery.trim()) return subscriptions;

        return subscriptions.filter(
            (subscription) =>
                subscription.serviceName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                subscription.buildingName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                subscription.apartmentNumber
                    .toString()
                    .includes(searchQuery.toLowerCase()) ||
                subscription.status
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [subscriptions, searchQuery]); // Fetch data
    const fetchData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const [
                subscriptionsData,
                servicesData,
                apartmentsData,
                buildingsData,
            ] = await Promise.all([
                getSubscriptions(),
                getServices(),
                getApartments(),
                getBuildings(),
            ]);

            // Create lookup maps for better performance
            const serviceMap = new Map(
                servicesData.map((service) => [service.id, service])
            );
            const apartmentMap = new Map(
                apartmentsData.map((apt) => [apt.id, apt])
            );
            const buildingMap = new Map(
                buildingsData.map((building) => [building.id, building])
            );

            // Enhance subscriptions with additional details
            const subscriptionsWithDetails: SubscriptionWithDetails[] =
                subscriptionsData.map((subscription) => {
                    const service = serviceMap.get(subscription.serviceId);
                    const apartment = apartmentMap.get(
                        subscription.apartmentId
                    );
                    const building = buildingMap.get(
                        apartment?.buildingId || ""
                    );

                    // Calculate revenue based on frequency and service price
                    const servicePrice = parseFloat(service?.unitPrice || "0");
                    let annualMultiplier = 1;

                    switch (subscription.frequency) {
                        case "monthly":
                            annualMultiplier = 12;
                            break;
                        case "quarterly":
                            annualMultiplier = 4;
                            break;
                        case "yearly":
                            annualMultiplier = 1;
                            break;
                    }

                    const totalRevenue =
                        subscription.status === "active"
                            ? servicePrice * annualMultiplier
                            : 0;

                    return {
                        ...subscription,
                        serviceName: service?.name || "Unknown Service",
                        servicePrice: service?.unitPrice || "0",
                        apartmentNumber: apartment?.roomNumber || 0,
                        buildingName: building?.name || "Unknown Building",
                        totalRevenue,
                    };
                });
            setSubscriptions(subscriptionsWithDetails);
            setServices(servicesData);
            setApartments(apartmentsData);
            setBuildings(buildingsData);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch data"
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form
    const handleOpenDialog = (subscription?: Subscription) => {
        if (subscription) {
            setEditingSubscription(subscription);
            setFormData({
                apartmentId: subscription.apartmentId,
                serviceId: subscription.serviceId,
                frequency: subscription.frequency,
                nextBillingDate: new Date(subscription.nextBillingDate),
                status: subscription.status,
            });
        } else {
            setEditingSubscription(null);
            setFormData({
                apartmentId: "",
                serviceId: "",
                frequency: "monthly",
                nextBillingDate: new Date(),
                status: "active",
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSubscription(null);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        try {
            setError(null);

            if (editingSubscription) {
                await updateSubscription(editingSubscription.id, {
                    frequency: formData.frequency,
                    nextBillingDate: formData.nextBillingDate.toISOString(),
                    status: formData.status,
                });
                setSuccess("Subscription updated successfully");
            } else {
                await createSubscription({
                    apartmentId: formData.apartmentId,
                    serviceId: formData.serviceId,
                    frequency: formData.frequency,
                    nextBillingDate: formData.nextBillingDate.toISOString(),
                });
                setSuccess("Subscription created successfully");
            }
            handleCloseDialog();
            await fetchData(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        }
    };

    const handleDelete = async (subscription: Subscription) => {
        if (
            window.confirm(
                `Are you sure you want to delete subscription for ${subscription.serviceId}?`
            )
        ) {
            try {
                await deleteSubscription(subscription.id);
                setSuccess("Subscription deleted successfully");
                await fetchData(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
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

    const getFrequencyLabel = (frequency: string) => {
        const option = FREQUENCY_OPTIONS.find((opt) => opt.value === frequency);
        return option ? option.label : frequency;
    };

    const getStatusInfo = (status: string) => {
        const option = STATUS_OPTIONS.find((opt) => opt.value === status);
        return option || { label: status, color: "default" as const };
    }; // Summary statistics
    const totalSubscriptions = filteredSubscriptions.length;
    const activeSubscriptions = filteredSubscriptions.filter(
        (sub) => sub.status === "active"
    ).length;
    const totalRevenue = filteredSubscriptions.reduce(
        (sum, sub) => sum + sub.totalRevenue,
        0
    );
    const averageRevenue =
        totalSubscriptions > 0 ? totalRevenue / totalSubscriptions : 0;

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}
            >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading subscriptions...</Typography>
            </Box>
        );
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                {/* Header */}{" "}
                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Quản lý đăng ký dịch vụ
                        </Typography>
                        {refreshing && <CircularProgress size={20} />}
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                        disabled={refreshing}
                    >
                        Thêm đăng ký
                    </Button>
                </Box>
                {/* Success/Error Messages */}
                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 2 }}
                        onClose={() => setSuccess(null)}
                    >
                        {success}
                    </Alert>
                )}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 2 }}
                        onClose={() => setError(null)}
                    >
                        {" "}
                        {error}
                    </Alert>
                )}{" "}
                {/* Search Bar */}
                <Paper
                    sx={{ p: 2, mb: 3, backgroundColor: "background.paper" }}
                >
                    <TextField
                        fullWidth
                        label="Tìm kiếm đăng ký dịch vụ"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm theo tên dịch vụ, tòa nhà, số phòng hoặc trạng thái..."
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "white",
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{ color: "action.active" }}
                                    />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>
                {/* Summary Statistics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: "center" }}>
                                <SubscriptionsIcon
                                    color="primary"
                                    sx={{ fontSize: 40, mb: 1 }}
                                />
                                <Typography variant="h4" component="div">
                                    {totalSubscriptions}
                                </Typography>
                                <Typography color="text.secondary">
                                    Total Subscriptions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: "center" }}>
                                <ActiveIcon
                                    color="success"
                                    sx={{ fontSize: 40, mb: 1 }}
                                />
                                <Typography variant="h4" component="div">
                                    {activeSubscriptions}
                                </Typography>
                                <Typography color="text.secondary">
                                    Active Subscriptions
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: "center" }}>
                                <MoneyIcon
                                    color="warning"
                                    sx={{ fontSize: 40, mb: 1 }}
                                />
                                <Typography variant="h4" component="div">
                                    {formatCurrency(totalRevenue)}
                                </Typography>
                                <Typography color="text.secondary">
                                    Total Annual Revenue
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent sx={{ textAlign: "center" }}>
                                <TrendingUpIcon
                                    color="info"
                                    sx={{ fontSize: 40, mb: 1 }}
                                />
                                <Typography variant="h4" component="div">
                                    {formatCurrency(averageRevenue)}
                                </Typography>
                                <Typography color="text.secondary">
                                    Avg Revenue/Sub
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                {/* Subscriptions Table */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Subscription List
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Service</TableCell>
                                        <TableCell>Apartment</TableCell>
                                        <TableCell>Frequency</TableCell>
                                        <TableCell>Next Billing</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Revenue/Year</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell align="center">
                                            Actions
                                        </TableCell>
                                    </TableRow>
                                </TableHead>{" "}
                                <TableBody>
                                    {filteredSubscriptions.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={8}
                                                align="center"
                                            >
                                                <Typography color="text.secondary">
                                                    {searchQuery.trim()
                                                        ? "No subscriptions found matching your search"
                                                        : "No subscriptions found"}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredSubscriptions.map(
                                            (subscription) => {
                                                const statusInfo =
                                                    getStatusInfo(
                                                        subscription.status
                                                    );
                                                return (
                                                    <TableRow
                                                        key={subscription.id}
                                                        hover
                                                    >
                                                        <TableCell>
                                                            <Box>
                                                                <Typography
                                                                    variant="body1"
                                                                    fontWeight="medium"
                                                                >
                                                                    {
                                                                        subscription.serviceName
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatCurrency(
                                                                        parseFloat(
                                                                            subscription.servicePrice
                                                                        )
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Box>
                                                                <Typography variant="body1">
                                                                    Room{" "}
                                                                    {
                                                                        subscription.apartmentNumber
                                                                    }
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        subscription.buildingName
                                                                    }
                                                                </Typography>
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={getFrequencyLabel(
                                                                    subscription.frequency
                                                                )}
                                                                size="small"
                                                                variant="outlined"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(
                                                                subscription.nextBillingDate
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    statusInfo.label
                                                                }
                                                                color={
                                                                    statusInfo.color
                                                                }
                                                                size="small"
                                                                icon={
                                                                    subscription.status ===
                                                                    "active" ? (
                                                                        <ActiveIcon />
                                                                    ) : (
                                                                        <InactiveIcon />
                                                                    )
                                                                }
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography
                                                                fontWeight="medium"
                                                                color={
                                                                    subscription.status ===
                                                                    "active"
                                                                        ? "success.main"
                                                                        : "text.secondary"
                                                                }
                                                            >
                                                                {formatCurrency(
                                                                    subscription.totalRevenue
                                                                )}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(
                                                                subscription.createdAt
                                                            )}
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            {" "}
                                                            <Tooltip title="Edit">
                                                                <IconButton
                                                                    color="primary"
                                                                    disabled={
                                                                        refreshing
                                                                    }
                                                                    onClick={() =>
                                                                        handleOpenDialog(
                                                                            subscription
                                                                        )
                                                                    }
                                                                >
                                                                    <EditIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip title="Delete">
                                                                <IconButton
                                                                    color="error"
                                                                    disabled={
                                                                        refreshing
                                                                    }
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            subscription
                                                                        )
                                                                    }
                                                                >
                                                                    <DeleteIcon />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            }
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
                {/* Add/Edit Dialog */}
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>
                        {editingSubscription
                            ? "Edit Subscription"
                            : "Add New Subscription"}
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                pt: 2,
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            {" "}
                            {!editingSubscription && (
                                <>
                                    {apartments.filter((apt) => apt.residentId)
                                        .length === 0 && (
                                        <Alert
                                            severity="warning"
                                            sx={{ mb: 2 }}
                                        >
                                            Không có căn hộ nào có cư dân. Vui
                                            lòng thêm cư dân vào căn hộ trước
                                            khi tạo đăng ký dịch vụ.
                                        </Alert>
                                    )}
                                    <FormControl fullWidth>
                                        <InputLabel>Service</InputLabel>
                                        <Select
                                            value={formData.serviceId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    serviceId: e.target.value,
                                                })
                                            }
                                            label="Service"
                                        >
                                            {services.map((service) => (
                                                <MenuItem
                                                    key={service.id}
                                                    value={service.id}
                                                >
                                                    {service.name} -{" "}
                                                    {formatCurrency(
                                                        parseFloat(
                                                            service.unitPrice
                                                        )
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel>Apartment</InputLabel>
                                        <Select
                                            value={formData.apartmentId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    apartmentId: e.target.value,
                                                })
                                            }
                                            label="Apartment"
                                        >
                                            {" "}
                                            {apartments.filter(
                                                (apartment) =>
                                                    apartment.residentId
                                            ).length === 0 ? (
                                                <MenuItem disabled>
                                                    Không có căn hộ nào có cư
                                                    dân
                                                </MenuItem>
                                            ) : (
                                                apartments
                                                    .filter(
                                                        (apartment) =>
                                                            apartment.residentId
                                                    ) // Chỉ hiển thị apartment có resident
                                                    .map((apartment) => {
                                                        const building =
                                                            buildings.find(
                                                                (b) =>
                                                                    b.id ===
                                                                    apartment.buildingId
                                                            );
                                                        return (
                                                            <MenuItem
                                                                key={
                                                                    apartment.id
                                                                }
                                                                value={
                                                                    apartment.id
                                                                }
                                                            >
                                                                Room{" "}
                                                                {
                                                                    apartment.roomNumber
                                                                }{" "}
                                                                -{" "}
                                                                {building?.name ||
                                                                    "Unknown Building"}
                                                            </MenuItem>
                                                        );
                                                    })
                                            )}
                                        </Select>
                                    </FormControl>
                                </>
                            )}
                            <FormControl fullWidth>
                                <InputLabel>Frequency</InputLabel>
                                <Select
                                    value={formData.frequency}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            frequency: e.target.value,
                                        })
                                    }
                                    label="Frequency"
                                >
                                    {FREQUENCY_OPTIONS.map((option) => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>{" "}
                            <DatePicker
                                label="Next Billing Date"
                                value={formData.nextBillingDate}
                                onChange={(newValue) =>
                                    setFormData({
                                        ...formData,
                                        nextBillingDate: newValue || new Date(),
                                    })
                                }
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                    },
                                }}
                            />
                            {editingSubscription && (
                                <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                status: e.target.value,
                                            })
                                        }
                                        label="Status"
                                    >
                                        {STATUS_OPTIONS.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>{" "}
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            disabled={
                                !editingSubscription &&
                                (!formData.serviceId ||
                                    !formData.apartmentId ||
                                    apartments.filter((apt) => apt.residentId)
                                        .length === 0)
                            }
                        >
                            {editingSubscription ? "Update" : "Create"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </LocalizationProvider>
    );
}
