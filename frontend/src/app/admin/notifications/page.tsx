"use client";

import React, { useState, useEffect } from "react";
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
    Alert,
    CircularProgress,
    Fab,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Notifications as NotificationsIcon,
    Campaign as AnnouncementIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Send as SendIcon,
} from "@mui/icons-material";

import {
    getNotifications,
    createNotification,
    Notification,
} from "@/services/notification";

const MESSAGE_TYPES = [
    {
        value: "info",
        label: "Thông tin",
        color: "info" as const,
        icon: InfoIcon,
    },
    {
        value: "warning",
        label: "Cảnh báo",
        color: "warning" as const,
        icon: WarningIcon,
    },
    {
        value: "error",
        label: "Khẩn cấp",
        color: "error" as const,
        icon: ErrorIcon,
    },
    {
        value: "announcement",
        label: "Thông báo",
        color: "primary" as const,
        icon: AnnouncementIcon,
    },
];

export default function NotificationsManagement() {
    // State for data
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Dialog states
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        message: "",
    });

    // Fetch data
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const notificationsData = await getNotifications();
            setNotifications(notificationsData);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Không thể tải danh sách thông báo"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form
    const handleOpenDialog = () => {
        setFormData({
            message: "",
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setError(null);
        setSuccess(null);
    };

    const handleSend = async () => {
        try {
            setError(null);

            if (!formData.message.trim()) {
                setError("Nội dung thông báo là bắt buộc");
                return;
            }

            await createNotification({
                message: formData.message.trim(),
            });

            setSuccess("Gửi thông báo thành công");
            handleCloseDialog();
            await fetchData();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Không thể gửi thông báo"
            );
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN");
    };

    const getMessageType = (message: string) => {
        const lowerMessage = message.toLowerCase();
        if (
            lowerMessage.includes("khẩn") ||
            lowerMessage.includes("emergency") ||
            lowerMessage.includes("cảnh báo khẩn")
        ) {
            return (
                MESSAGE_TYPES.find((t) => t.value === "error") ||
                MESSAGE_TYPES[0]
            );
        }
        if (
            lowerMessage.includes("cảnh báo") ||
            lowerMessage.includes("warning") ||
            lowerMessage.includes("chú ý")
        ) {
            return (
                MESSAGE_TYPES.find((t) => t.value === "warning") ||
                MESSAGE_TYPES[0]
            );
        }
        if (
            lowerMessage.includes("thông báo") ||
            lowerMessage.includes("announcement") ||
            lowerMessage.includes("sự kiện")
        ) {
            return (
                MESSAGE_TYPES.find((t) => t.value === "announcement") ||
                MESSAGE_TYPES[0]
            );
        }
        return (
            MESSAGE_TYPES.find((t) => t.value === "info") || MESSAGE_TYPES[0]
        );
    };

    // Calculate summary statistics
    const totalNotifications = notifications.length;
    const recentNotifications = notifications.filter((n) => {
        const notifDate = new Date(n.createdAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return notifDate >= sevenDaysAgo;
    }).length;

    const todayNotifications = notifications.filter((n) => {
        const notifDate = new Date(n.createdAt);
        const today = new Date();
        return notifDate.toDateString() === today.toDateString();
    }).length;
    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Quản lý thông báo
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleOpenDialog}
                    sx={{ backgroundColor: "#1976d2" }}
                >
                    Gửi thông báo
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
                    {error}
                </Alert>
            )}

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <NotificationsIcon
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
                                        Tổng thông báo
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {totalNotifications}
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
                                }}
                            >
                                <AnnouncementIcon
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
                                        7 ngày qua
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {recentNotifications}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card>
                        {" "}
                        <CardContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <SendIcon
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
                                        Hôm nay
                                    </Typography>
                                    <Typography variant="h4" component="div">
                                        {todayNotifications}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Notifications Table */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Danh sách thông báo
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Message</TableCell>
                                    <TableCell>Created</TableCell>
                                    <TableCell>ID</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {notifications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            <Typography color="text.secondary">
                                                No notifications found
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    notifications.map((notification) => {
                                        const messageType = getMessageType(
                                            notification.message
                                        );
                                        const TypeIcon = messageType.icon;
                                        return (
                                            <TableRow
                                                key={notification.id}
                                                hover
                                            >
                                                <TableCell>
                                                    <Chip
                                                        icon={<TypeIcon />}
                                                        label={
                                                            messageType.label
                                                        }
                                                        color={
                                                            messageType.color
                                                        }
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ maxWidth: 400 }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                display:
                                                                    "-webkit-box",
                                                                WebkitLineClamp: 3,
                                                                WebkitBoxOrient:
                                                                    "vertical",
                                                                whiteSpace:
                                                                    "pre-wrap",
                                                            }}
                                                        >
                                                            {
                                                                notification.message
                                                            }
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography variant="body2">
                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            fontFamily:
                                                                "monospace",
                                                        }}
                                                    >
                                                        {notification.id.substring(
                                                            0,
                                                            8
                                                        )}
                                                        ...
                                                    </Typography>
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

            {/* Send Notification Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                {" "}
                <DialogTitle>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <SendIcon sx={{ mr: 1, color: "#1976d2" }} />
                        Gửi thông báo mới
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Thông báo sẽ được gửi đến tất cả cư dân trong hệ
                            thống.
                        </Alert>

                        <TextField
                            fullWidth
                            label="Nội dung thông báo"
                            multiline
                            rows={6}
                            value={formData.message}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    message: e.target.value,
                                })
                            }
                            placeholder="Nhập nội dung thông báo..."
                            helperText="Sử dụng từ khóa như 'cảnh báo', 'khẩn cấp', 'thông báo' để hệ thống tự động phân loại"
                        />

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Loại thông báo dự kiến:
                            </Typography>
                            {formData.message && (
                                <Box sx={{ mt: 1 }}>
                                    {(() => {
                                        const messageType = getMessageType(
                                            formData.message
                                        );
                                        const TypeIcon = messageType.icon;
                                        return (
                                            <Chip
                                                icon={<TypeIcon />}
                                                label={messageType.label}
                                                color={messageType.color}
                                                size="small"
                                            />
                                        );
                                    })()}
                                </Box>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button
                        onClick={handleSend}
                        variant="contained"
                        startIcon={<SendIcon />}
                        disabled={!formData.message.trim()}
                        sx={{ backgroundColor: "#1976d2" }}
                    >
                        Gửi thông báo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button for quick access */}
            <Fab
                color="primary"
                aria-label="send notification"
                onClick={handleOpenDialog}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                }}
            >
                <SendIcon />
            </Fab>
        </Box>
    );
}
