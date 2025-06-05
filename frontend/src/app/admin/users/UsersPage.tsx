// app/admin/users/UsersPage.tsx
"use client";

import React from "react";
import { Box, Typography, Button, Alert } from "@mui/material";
import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { useUsers } from "@/hooks/useUsers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AppError } from "@/core/error-handling";

/**
 * Users Page Component
 * Demonstrates SOLID principles implementation:
 * - SRP: Only handles user page presentation
 * - OCP: Extensible through props and composition
 * - LSP: Can be substituted with other page components
 * - ISP: Uses focused hooks and services
 * - DIP: Depends on abstractions through hooks
 */
const UsersPage: React.FC = () => {
    const { users, loading, error, fetchUsers, searchUsers, clearError } =
        useUsers();

    const handleRefresh = () => {
        clearError();
        fetchUsers();
    };

    const handleSearch = (query: string) => {
        if (query.trim()) {
            searchUsers(query);
        } else {
            fetchUsers();
        }
    }; // Error state with proper error type handling
    if (error) {
        return (
            <Box p={3}>
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={handleRefresh}
                        >
                            Thử lại
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            {/* Page Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" component="h1">
                    Quản lý người dùng
                </Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        color="primary"
                    >
                        Thêm người dùng
                    </Button>
                </Box>
            </Box>

            {/* Search Box */}
            <Box mb={3}>
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng..."
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px 16px",
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        fontSize: "16px",
                    }}
                />
            </Box>

            {/* Users List */}
            <Box>
                {loading ? (
                    <Typography>Đang tải...</Typography>
                ) : users.length === 0 ? (
                    <Alert severity="info">Không tìm thấy người dùng nào</Alert>
                ) : (
                    <Box display="grid" gap={2}>
                        {users.map((user) => (
                            <Box
                                key={user.id}
                                p={2}
                                border="1px solid #e0e0e0"
                                borderRadius={2}
                                bgcolor="background.paper"
                            >
                                <Typography variant="h6">
                                    {user.fullName}
                                </Typography>
                                <Typography color="text.secondary">
                                    {user.email}
                                </Typography>
                                <Typography variant="body2">
                                    Vai trò:{" "}
                                    {user.role === "admin"
                                        ? "Quản trị viên"
                                        : "Cư dân"}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

/**
 * Users Page with Error Boundary
 * Demonstrates proper error handling integration
 */
const UsersPageContainer: React.FC = () => {
    return (
        <ErrorBoundary>
            <UsersPage />
        </ErrorBoundary>
    );
};

export default UsersPageContainer;
