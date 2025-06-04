// components/ErrorBoundary/index.tsx
"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Box, Button } from "@mui/material";
import { AppError, ErrorService } from "@/core/error-handling";
import { AppBootstrap } from "@/core/app-bootstrap";
import { SERVICE_TOKENS } from "@/core/di-container";

interface Props {
    children: ReactNode;
    fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Follows Single Responsibility Principle by handling only error boundaries
 * Uses dependency injection for error handling service
 */
export class ErrorBoundary extends Component<Props, State> {
    private errorService: ErrorService;

    constructor(props: Props) {
        super(props);

        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };

        // Get error service from DI container
        this.errorService = AppBootstrap.getService<ErrorService>(
            SERVICE_TOKENS.ERROR_SERVICE
        );
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Handle error through our error service
        this.errorService.handleError(error);

        console.error("Error caught by boundary:", error, errorInfo);
    }

    private handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback(
                    this.state.error!,
                    this.state.errorInfo!
                );
            }

            // Default error UI
            const errorMessage =
                this.state.error instanceof AppError
                    ? this.state.error.message
                    : "Đã xảy ra lỗi không mong muốn";

            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    padding={4}
                    gap={2}
                >
                    <Alert
                        severity="error"
                        sx={{ width: "100%", maxWidth: 600 }}
                    >
                        <Box>
                            <strong>Lỗi ứng dụng</strong>
                            <div>{errorMessage}</div>
                        </Box>
                    </Alert>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReset}
                    >
                        Thử lại
                    </Button>

                    {process.env.NODE_ENV === "development" &&
                        this.state.errorInfo && (
                            <details
                                style={{
                                    whiteSpace: "pre-wrap",
                                    fontSize: "12px",
                                    color: "#666",
                                }}
                            >
                                <summary>Chi tiết lỗi (Development)</summary>
                                {this.state.error &&
                                    this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </details>
                        )}
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
