"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tabs,
    Tab,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { getBuildings, createApartment, Building } from "@/services/building";
import { ApartmentManagementTable } from "./components/ApartmentManagementTable";

const AdminApartmentPage = () => {
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [selectedBuildingId, setSelectedBuildingId] = useState("");
    const [roomNumber, setRoomNumber] = useState("");
    const [area, setArea] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchBuildings = async () => {
            try {
                const buildingData = await getBuildings();
                setBuildings(buildingData);
            } catch (error) {
                console.error("Error fetching buildings:", error);
                setMessage("Failed to load buildings");
                setIsError(true);
            }
        };

        fetchBuildings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBuildingId || !roomNumber || !area) {
            setMessage("Please fill in all fields");
            setIsError(true);
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            await createApartment({
                roomNumber: parseInt(roomNumber),
                area: parseFloat(area),
                buildingId: selectedBuildingId,
            });

            setMessage(
                "Apartment created successfully! It is now vacant and ready for assignment."
            );
            setIsError(false);

            // Reset form
            setRoomNumber("");
            setArea("");
            setSelectedBuildingId("");
        } catch (error: any) {
            setMessage(error.message || "Failed to create apartment");
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const renderCreateForm = () => (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Create New Apartment
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    New apartments are automatically created as vacant and ready
                    for resident assignment.
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Building</InputLabel>
                                <Select
                                    value={selectedBuildingId}
                                    onChange={(e) =>
                                        setSelectedBuildingId(e.target.value)
                                    }
                                    label="Building"
                                >
                                    {buildings.map((building) => (
                                        <MenuItem
                                            key={building.id}
                                            value={building.id}
                                        >
                                            {building.name} - {building.address}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Room Number"
                                type="number"
                                value={roomNumber}
                                onChange={(e) => setRoomNumber(e.target.value)}
                                placeholder="e.g., 101"
                            />
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <TextField
                                fullWidth
                                label="Area (m²)"
                                type="number"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                placeholder="e.g., 75.5"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={
                                    loading ? (
                                        <CircularProgress size={20} />
                                    ) : null
                                }
                                sx={{ mt: 1 }}
                            >
                                {loading
                                    ? "Creating..."
                                    : "Create Vacant Apartment"}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Apartments Management
            </Typography>

            {message && (
                <Alert severity={isError ? "error" : "success"} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <Box
                sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                    mb: 2,
                    backgroundColor: "background.paper",
                    borderRadius: 1.5,
                }}
            >
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Create Apartment" />
                    <Tab label="Manage Apartments" />
                </Tabs>
            </Box>

            {tabValue === 0 && renderCreateForm()}
            {tabValue === 1 && <ApartmentManagementTable />}
        </Box>
    );
};

export default AdminApartmentPage;
