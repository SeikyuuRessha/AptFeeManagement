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
    Apartment as ApartmentIcon,
    LocationOn as LocationIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import Grid from "@mui/material/GridLegacy";
import {
    getBuildings,
    getApartments,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    Building,
    Apartment,
} from "@/services/building";

interface BuildingWithStats extends Building {
    totalApartments: number;
    occupiedApartments: number;
    occupancyRate: number;
}

const AdminBuildingsPage = () => {
    const [buildings, setBuildings] = useState<BuildingWithStats[]>([]);
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [editingBuilding, setEditingBuilding] = useState<Building | null>(
        null
    );
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        apartmentCount: 0,
    });

    // Filter buildings based on search query
    const filteredBuildings = React.useMemo(() => {
        if (!searchQuery.trim()) return buildings;

        return buildings.filter(
            (building) =>
                building.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                building.address
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        );
    }, [buildings, searchQuery]);

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [buildingsData, apartmentsData] = await Promise.all([
                getBuildings(),
                getApartments(),
            ]);

            // Calculate statistics for each building
            const buildingsWithStats: BuildingWithStats[] = buildingsData.map(
                (building) => {
                    const buildingApartments = apartmentsData.filter(
                        (apt) => apt.buildingId === building.id
                    );
                    const occupiedApartments = buildingApartments.filter(
                        (apt) => apt.residentId && apt.residentId.trim() !== ""
                    );

                    return {
                        ...building,
                        totalApartments: buildingApartments.length,
                        occupiedApartments: occupiedApartments.length,
                        occupancyRate:
                            buildingApartments.length > 0
                                ? (occupiedApartments.length /
                                      buildingApartments.length) *
                                  100
                                : 0,
                    };
                }
            );

            setBuildings(buildingsWithStats);
            setApartments(apartmentsData);
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
    const handleOpenDialog = (building?: Building) => {
        if (building) {
            setEditingBuilding(building);
            setFormData({
                name: building.name,
                address: building.address,
                apartmentCount: building.apartmentCount,
            });
        } else {
            setEditingBuilding(null);
            setFormData({
                name: "",
                address: "",
                apartmentCount: 0,
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingBuilding(null);
        setFormData({
            name: "",
            address: "",
            apartmentCount: 0,
        });
    };

    const handleSubmit = async () => {
        try {
            if (editingBuilding) {
                // Update building
                await updateBuilding(editingBuilding.id, formData);
                setSuccess("Building updated successfully");
            } else {
                // Create building
                await createBuilding(formData);
                setSuccess("Building created successfully");
            }

            handleCloseDialog();
            await fetchData();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Operation failed");
        }
    };

    const handleDelete = async (buildingId: string) => {
        if (window.confirm("Are you sure you want to delete this building?")) {
            try {
                await deleteBuilding(buildingId);
                setSuccess("Building deleted successfully");
                await fetchData();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Delete failed");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN");
    };

    // Summary statistics
    const totalBuildings = buildings.length;
    const totalApartments = buildings.reduce(
        (sum, building) => sum + building.totalApartments,
        0
    );
    const totalOccupied = buildings.reduce(
        (sum, building) => sum + building.occupiedApartments,
        0
    );
    const overallOccupancyRate =
        totalApartments > 0 ? (totalOccupied / totalApartments) * 100 : 0;

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quản lý Tòa nhà
                </Typography>
                <LinearProgress />
                <Typography sx={{ mt: 2 }}>
                    Đang tải danh sách tòa nhà...
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
                    Quản lý Tòa nhà
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                    sx={{ backgroundColor: "#1976d2" }}
                >
                    Thêm Tòa nhà
                </Button>
            </Box>

            {/* Search Bar */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: "background.paper" }}>
                <TextField
                    fullWidth
                    label="Tìm kiếm tòa nhà"
                    placeholder="Tìm kiếm theo tên tòa nhà hoặc địa chỉ..."
                    variant="outlined"
                    size="medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <LocationIcon
                                    color="primary"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalBuildings}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Total Buildings
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
                                    gap: 2,
                                }}
                            >
                                <ApartmentIcon
                                    color="success"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalApartments}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Total Apartments
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
                                    gap: 2,
                                }}
                            >
                                <ApartmentIcon
                                    color="warning"
                                    sx={{ fontSize: 40 }}
                                />
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {totalOccupied}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Occupied Units
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
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        backgroundColor:
                                            overallOccupancyRate >= 80
                                                ? "#4caf50"
                                                : overallOccupancyRate >= 60
                                                ? "#ff9800"
                                                : "#f44336",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    %
                                </Box>
                                <Box>
                                    <Typography variant="h4" component="div">
                                        {overallOccupancyRate.toFixed(1)}%
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Occupancy Rate
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Buildings Table */}
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                    Tên
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>
                                    Địa chỉ
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Tổng CH
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Căn hộ
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Đã thuê
                                </TableCell>
                                <TableCell
                                    align="center"
                                    sx={{ fontWeight: "bold" }}
                                >
                                    Tỷ lệ lấp đầy
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
                            {filteredBuildings.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{ py: 4 }}
                                    >
                                        <Typography color="text.secondary">
                                            No buildings found. Click "Add
                                            Building" to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBuildings.map((building) => (
                                    <TableRow key={building.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {building.name}
                                        </TableCell>
                                        <TableCell>
                                            {building.address}
                                        </TableCell>
                                        <TableCell align="center">
                                            {building.apartmentCount}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={building.totalApartments}
                                                size="small"
                                                color="primary"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    building.occupiedApartments
                                                }
                                                size="small"
                                                color="success"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={`${building.occupancyRate.toFixed(
                                                    1
                                                )}%`}
                                                size="small"
                                                color={
                                                    building.occupancyRate >= 80
                                                        ? "success"
                                                        : building.occupancyRate >=
                                                          60
                                                        ? "warning"
                                                        : "error"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {formatDate(building.createdAt)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleOpenDialog(building)
                                                }
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(building.id)
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
                    {editingBuilding ? "Chỉnh sửa Tòa nhà" : "Thêm Tòa nhà Mới"}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Tên Tòa nhà"
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
                            label="Địa chỉ"
                            value={formData.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    address: e.target.value,
                                })
                            }
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Số lượng Căn hộ"
                            type="number"
                            value={formData.apartmentCount}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    apartmentCount:
                                        parseInt(e.target.value) || 0,
                                })
                            }
                            margin="normal"
                            required
                            inputProps={{ min: 0 }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.name || !formData.address}
                    >
                        {editingBuilding ? "Cập nhật" : "Tạo"}
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

export default AdminBuildingsPage;
