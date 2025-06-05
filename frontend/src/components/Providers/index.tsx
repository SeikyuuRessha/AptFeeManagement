"use client";

import { ReactNode, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Authenticate from "./Authenticate";
import StyledComponentsRegistry from "@/lib/registry";
import { AppBootstrap } from "@/core/app-bootstrap";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
    // Initialize DI container on app startup
    useEffect(() => {
        AppBootstrap.initialize();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Authenticate>{children}</Authenticate>
        </QueryClientProvider>
    );
};

export default Providers;
