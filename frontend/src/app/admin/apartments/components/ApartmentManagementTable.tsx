import React, { useState, useEffect } from "react";
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
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TablePagination,
    Tooltip,
    InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Home,
    Person,
    MonetizationOn,
    Business,
    CheckCircle,
    Cancel,
    Search as SearchIcon,
} from "@mui/icons-material";
import {
    getApartments,
    getBuildings,
    Apartment,
    Building,
} from "@/services/building";
import { getUsers } from "@/services/user";
import { IUser } from "@/interfaces/user";

interface ApartmentWithDetails extends Apartment {
    buildingName: string;
    residentName: string | null;
    status: "occupied" | "vacant";
    monthlyRent: number;
}

export const ApartmentManagementTable: React.FC = () => {
    const [apartments, setApartments] = useState<ApartmentWithDetails[]>([]);
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [buildingFilter, setBuildingFilter] = useState("all");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const calculateMonthlyRent = (apartment: Apartment): number => {
        const baseRentPerSqm = 50000;

        const areaMultiplier =
            apartment.area > 100
                ? 1.2
                : apartment.area > 75
                ? 1.1
                : apartment.area > 50
                ? 1.0
                : 0.9;

        return Math.round(apartment.area * baseRentPerSqm * areaMultiplier);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [apartmentData, buildingData, userData] =
                    await Promise.all([
                        getApartments(),
                        getBuildings(),
                        getUsers(),
                    ]);

                setBuildings(buildingData);
                setUsers(userData); // Combine apartment data with building and user info
                const apartmentsWithDetails: ApartmentWithDetails[] =
                    apartmentData.map((apt) => {
                        const building = buildingData.find(
                            (b) => b.id === apt.buildingId
                        );
                        const resident = userData.find(
                            (u) => u.id === apt.residentId
                        );
                        return {
                            ...apt,
                            buildingName: building?.name || "Unknown Building",
                            residentName: resident?.fullName || null,
                            status: apt.residentId ? "occupied" : "vacant",
                            monthlyRent: apt.residentId
                                ? calculateMonthlyRent(apt)
                                : 0,
                        };
                    });

                setApartments(apartmentsWithDetails);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get unique buildings for filter
    const uniqueBuildings = [
        ...new Set(apartments.map((apt) => apt.buildingName)),
    ];

    // Filter apartments based on search and filters
    const filteredApartments = apartments.filter((apartment) => {
        const matchesSearch =
            (apartment.roomNumber &&
                apartment.roomNumber
                    .toString()
                    .includes(searchTerm.toLowerCase())) ||
            (apartment.buildingName &&
                apartment.buildingName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (apartment.residentName &&
                apartment.residentName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()));

        const matchesStatus =
            statusFilter === "all" || apartment.status === statusFilter;

        const matchesBuilding =
            buildingFilter === "all" ||
            apartment.buildingName === buildingFilter;

        return matchesSearch && matchesStatus && matchesBuilding;
    });

    // Paginate results
    const paginatedApartments = filteredApartments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusIcon = (status: "occupied" | "vacant") => {
        return status === "occupied" ? (
            <CheckCircle sx={{ color: "#4caf50", fontSize: 20 }} />
        ) : (
            <Cancel sx={{ color: "#f44336", fontSize: 20 }} />
        );
    };

    const getStatusChip = (status: "occupied" | "vacant") => {
        return (
            <Chip
                label={status === "occupied" ? "Occupied" : "Vacant"}
                color={status === "occupied" ? "success" : "warning"}
                size="small"
                icon={getStatusIcon(status)}
            />
        );
    };

    if (loading) {
        return (
            <Paper sx={{ mt: 3, p: 3, textAlign: "center" }}>
                <Typography>Loading apartments...</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Apartments Management
            </Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {" "}
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Tìm kiếm căn hộ"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm theo số phòng, tòa nhà hoặc cư dân..."
                        size="small"
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
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={statusFilter}
                            label="Status"
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="occupied">Occupied</MenuItem>
                            <MenuItem value="vacant">Vacant</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small">
                        <InputLabel>Building</InputLabel>
                        <Select
                            value={buildingFilter}
                            label="Building"
                            onChange={(e) => setBuildingFilter(e.target.value)}
                        >
                            <MenuItem value="all">All Buildings</MenuItem>
                            {uniqueBuildings.map((building) => (
                                <MenuItem key={building} value={building}>
                                    {building}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* Summary Statistics */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                    <Box
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: "primary.light",
                            color: "white",
                            borderRadius: 1,
                        }}
                    >
                        <Home sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">
                            {filteredApartments.length}
                        </Typography>
                        <Typography variant="caption">Total Units</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: "success.light",
                            color: "white",
                            borderRadius: 1,
                        }}
                    >
                        <CheckCircle sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">
                            {
                                filteredApartments.filter(
                                    (apt) => apt.status === "occupied"
                                ).length
                            }
                        </Typography>
                        <Typography variant="caption">Occupied</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: "warning.light",
                            color: "white",
                            borderRadius: 1,
                        }}
                    >
                        <Cancel sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">
                            {
                                filteredApartments.filter(
                                    (apt) => apt.status === "vacant"
                                ).length
                            }
                        </Typography>
                        <Typography variant="caption">Vacant</Typography>
                    </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                    <Box
                        sx={{
                            p: 2,
                            textAlign: "center",
                            backgroundColor: "info.light",
                            color: "white",
                            borderRadius: 1,
                        }}
                    >
                        <MonetizationOn sx={{ fontSize: 30, mb: 1 }} />
                        <Typography variant="h6">
                            {formatCurrency(
                                filteredApartments
                                    .filter((apt) => apt.status === "occupied")
                                    .reduce(
                                        (sum, apt) => sum + apt.monthlyRent,
                                        0
                                    )
                            )}
                        </Typography>
                        <Typography variant="caption">
                            Monthly Revenue
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            {/* Apartments Table */}
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Apartment
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Building
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                Resident
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold" }}
                            >
                                Status
                            </TableCell>
                            <TableCell
                                align="right"
                                sx={{ fontWeight: "bold" }}
                            >
                                Monthly Rent
                            </TableCell>
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold" }}
                            >
                                Size (m²)
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedApartments.map((apartment) => (
                            <TableRow
                                key={apartment.id}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: 500 }}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Home
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: 18,
                                            }}
                                        />
                                        {apartment.roomNumber}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Business
                                            sx={{
                                                color: "text.secondary",
                                                fontSize: 18,
                                            }}
                                        />
                                        {apartment.buildingName}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    {apartment.residentName ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 1,
                                            }}
                                        >
                                            <Person
                                                sx={{
                                                    color: "text.secondary",
                                                    fontSize: 18,
                                                }}
                                            />
                                            <Tooltip
                                                title={apartment.residentName}
                                            >
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        maxWidth: 150,
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {apartment.residentName}
                                                </Typography>
                                            </Tooltip>
                                        </Box>
                                    ) : (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ fontStyle: "italic" }}
                                        >
                                            No resident
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {getStatusChip(apartment.status)}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{ fontWeight: 500 }}
                                >
                                    {apartment.status === "occupied"
                                        ? formatCurrency(apartment.monthlyRent)
                                        : "-"}
                                </TableCell>
                                <TableCell align="center">
                                    {apartment.area.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredApartments.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
};
