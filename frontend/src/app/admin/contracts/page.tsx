"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Chip,
    Tooltip,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    Assignment as AssignmentIcon,
    PendingActions as PendingIcon,
    CheckCircle as ActiveIcon,
    Cancel as ExpiredIcon,
    Search as SearchIcon,
} from "@mui/icons-material";

import {
    getContracts,
    createContract,
    updateContract,
    deleteContract,
    Contract,
    CreateContractData,
    UpdateContractData,
} from "@/services/contract";
import { getUsers } from "@/services/user";
import { IUser } from "@/interfaces/user";

// Extended interface for contracts with resident details
interface ContractWithDetails extends Contract {
    residentName: string;
    residentEmail: string;
    residentPhone: string;
}

const STATUS_OPTIONS = [
    {
        value: "PENDING",
        label: "Chờ xử lý",
        color: "warning" as const,
        icon: PendingIcon,
    },
    {
        value: "ACTIVE",
        label: "Đang hiệu lực",
        color: "success" as const,
        icon: ActiveIcon,
    },
    {
        value: "EXPIRED",
        label: "Hết hạn",
        color: "error" as const,
        icon: ExpiredIcon,
    },
    {
        value: "TERMINATED",
        label: "Đã chấm dứt",
        color: "error" as const,
        icon: ExpiredIcon,
    },
];

export default function ContractsManagement() {
    // State for data
    const [contracts, setContracts] = useState<ContractWithDetails[]>([]);
    const [residents, setResidents] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingContract, setEditingContract] = useState<Contract | null>(
        null
    );
    const [formData, setFormData] = useState({
        residentId: "",
        status: "PENDING",
        documentPath: "",
    });

    // Filter contracts based on search query
    const filteredContracts = useMemo(() => {
        if (!searchQuery.trim()) return contracts;

        return contracts.filter(
            (contract) =>
                contract.residentName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                contract.residentEmail
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                contract.residentPhone
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                contract.status
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                contract.documentPath
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [contracts, searchQuery]);

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [contractsData, residentsData] = await Promise.all([
                getContracts(),
                getUsers(),
            ]);

            // Create lookup map for residents
            const residentMap = new Map(
                residentsData.map((resident) => [resident.id, resident])
            );

            // Enhance contracts with resident details
            const contractsWithDetails: ContractWithDetails[] =
                contractsData.map((contract) => {
                    const resident = residentMap.get(contract.residentId);

                    return {
                        ...contract,
                        residentName: resident?.fullName || "Unknown Resident",
                        residentEmail: resident?.email || "",
                        residentPhone: resident?.phone || "",
                    };
                });

            setContracts(contractsWithDetails);
            setResidents(residentsData);
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
    const handleOpenDialog = (contract?: Contract) => {
        if (contract) {
            setEditingContract(contract);
            setFormData({
                residentId: contract.residentId,
                status: contract.status,
                documentPath: contract.documentPath,
            });
        } else {
            setEditingContract(null);
            setFormData({
                residentId: "",
                status: "PENDING",
                documentPath: "",
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingContract(null);
        setError(null);
        setSuccess(null);
    };

    const handleSave = async () => {
        try {
            setError(null);

            if (editingContract) {
                await updateContract(editingContract.id, {
                    status: formData.status,
                    documentPath: formData.documentPath,
                });
                setSuccess("Contract updated successfully");
            } else {
                await createContract({
                    residentId: formData.residentId,
                    status: formData.status,
                    documentPath: formData.documentPath,
                });
                setSuccess("Contract created successfully");
            }

            handleCloseDialog();
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
        }
    };

    const handleDelete = async (contract: Contract) => {
        if (
            window.confirm(
                `Are you sure you want to delete the contract for ${contract.residentId}?`
            )
        ) {
            try {
                await deleteContract(contract.id);
                setSuccess("Contract deleted successfully");
                await fetchData();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    const getStatusInfo = (status: string) => {
        return (
            STATUS_OPTIONS.find((option) => option.value === status) ||
            STATUS_OPTIONS[0]
        );
    }; // Calculate summary statistics
    const totalContracts = filteredContracts.length;
    const activeContracts = filteredContracts.filter(
        (c) => c.status === "ACTIVE"
    ).length;
    const pendingContracts = filteredContracts.filter(
        (c) => c.status === "PENDING"
    ).length;
    const expiredContracts = filteredContracts.filter(
        (c) => c.status === "EXPIRED" || c.status === "TERMINATED"
    ).length;

    // Available residents (not having contracts or editing current contract)
    const availableResidents = residents.filter((resident) => {
        const hasContract = contracts.some(
            (contract) =>
                contract.residentId === resident.id &&
                (!editingContract || editingContract.residentId !== resident.id)
        );
        return !hasContract;
    });

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
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
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Quản lý hợp đồng
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ backgroundColor: "#1976d2" }}
                >
                    Thêm hợp đồng
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
            )}

            {/* Search Bar */}
            <Paper
                sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                }}
            >
                <TextField
                    fullWidth
                    label="Tìm kiếm hợp đồng"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên cư dân, email, số điện thoại, trạng thái hoặc đường dẫn tài liệu..."
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "action.active" }} />
                            </InputAdornment>
                        ),
                        sx: {
                            backgroundColor: "white",
                            "& .MuiOutlinedInput-root": {
                                backgroundColor: "white",
                            },
                        },
                    }}
                />
            </Paper>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <DescriptionIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#1976d2",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Tổng hợp đồng
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {totalContracts}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <ActiveIcon
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
                                        Đang hiệu lực
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {activeContracts}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
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
                                        {pendingContracts}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <ExpiredIcon
                                    sx={{
                                        fontSize: 40,
                                        color: "#f44336",
                                        mr: 2,
                                    }}
                                />
                                <Box>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Hết hạn/Chấm dứt
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {expiredContracts}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/* Contracts Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Danh sách hợp đồng
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            {" "}
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cư dân</TableCell>
                                    <TableCell>Liên hệ</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Đường dẫn tài liệu</TableCell>
                                    <TableCell>Ngày tạo</TableCell>
                                    <TableCell align="center">
                                        Thao tác
                                    </TableCell>
                                </TableRow>
                            </TableHead>{" "}
                            <TableBody>
                                {filteredContracts.length === 0 ? (
                                    <TableRow>
                                        {" "}
                                        <TableCell colSpan={6} align="center">
                                            <Typography color="text.secondary">
                                                {searchQuery.trim()
                                                    ? "Không tìm thấy hợp đồng nào khớp với tìm kiếm"
                                                    : "Không tìm thấy hợp đồng nào"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredContracts.map((contract) => {
                                        const statusInfo = getStatusInfo(
                                            contract.status
                                        );
                                        const StatusIcon = statusInfo.icon;
                                        return (
                                            <TableRow key={contract.id} hover>
                                                <TableCell>
                                                    <Box>
                                                        <Typography
                                                            variant="body1"
                                                            fontWeight="medium"
                                                        >
                                                            {
                                                                contract.residentName
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            ID:
                                                            {contract.residentId.substring(
                                                                0,
                                                                8
                                                            )}
                                                            ...
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {
                                                                contract.residentEmail
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {
                                                                contract.residentPhone
                                                            }
                                                        </Typography>
                                                    </Box>
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
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                        }}
                                                    >
                                                        {contract.documentPath}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        contract.createdAt
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Chỉnh sửa">
                                                        <IconButton
                                                            color="primary"
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    contract
                                                                )
                                                            }
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Xóa">
                                                        <IconButton
                                                            color="error"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    contract
                                                                )
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
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
            {/* Add/Edit Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingContract
                        ? "Chỉnh sửa hợp đồng"
                        : "Thêm hợp đồng mới"}
                </DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            pt: 1,
                        }}
                    >
                        {!editingContract && (
                            <FormControl fullWidth>
                                <InputLabel>Cư dân</InputLabel>
                                <Select
                                    value={formData.residentId}
                                    label="Cư dân"
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            residentId: e.target.value,
                                        })
                                    }
                                >
                                    {availableResidents.map((resident) => (
                                        <MenuItem
                                            key={resident.id}
                                            value={resident.id}
                                        >
                                            {resident.fullName} -
                                            {resident.email}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <FormControl fullWidth>
                            {" "}
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                value={formData.status}
                                label="Trạng thái"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value,
                                    })
                                }
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

                        <TextField
                            fullWidth
                            label="Đường dẫn tài liệu"
                            value={formData.documentPath}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    documentPath: e.target.value,
                                })
                            }
                            placeholder="/contracts/documents/contract_001.pdf"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={
                            !formData.residentId || !formData.documentPath
                        }
                    >
                        {editingContract ? "Cập nhật" : "Tạo"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
