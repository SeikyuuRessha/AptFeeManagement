"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Authenticate from "./Authenticate";
import StyledComponentsRegistry from "@/lib/registry";

const queryClient = new QueryClient();

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<Authenticate>{children}</Authenticate>
		</QueryClientProvider>
	);
};

export default Providers;
