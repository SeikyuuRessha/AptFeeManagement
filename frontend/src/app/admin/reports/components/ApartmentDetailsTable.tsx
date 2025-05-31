import React, { useState } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Home,
    Person,
    MonetizationOn,
    Business,
    CheckCircle,
    Cancel,
} from "@mui/icons-material";
import { ApartmentData } from "../hooks/useReportsData";

interface ApartmentDetailsTableProps {
    data: ApartmentData;
}

export const ApartmentDetailsTable: React.FC<ApartmentDetailsTableProps> = ({
    data,
}) => {
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

    // Get unique buildings for filter
    const uniqueBuildings = [
        ...new Set(data.apartmentDetails.map((apt) => apt.buildingName)),
    ]; // Filter apartments based on search and filters
    const filteredApartments = data.apartmentDetails.filter((apartment) => {
        const matchesSearch =
            (apartment.number &&
                apartment.number
                    .toLowerCase()
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

    return (
        <Paper sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
                Apartment Details
            </Typography>

            {/* Filters */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Search apartments"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by apartment number, building, or resident"
                        size="small"
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
                            <TableCell
                                align="center"
                                sx={{ fontWeight: "bold" }}
                            >
                                Rooms
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
                                        {apartment.number}
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
                                    {formatCurrency(apartment.monthlyRent)}
                                </TableCell>
                                <TableCell align="center">
                                    {apartment.size}
                                </TableCell>
                                <TableCell align="center">
                                    {apartment.rooms}
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
