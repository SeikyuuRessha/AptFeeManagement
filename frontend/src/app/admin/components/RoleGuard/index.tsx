"use client";

import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function RoleGuard({ children }: { children: ReactNode }) {
	const { user } = useUserStore();
	const router = useRouter();

	useEffect(() => {
		if (user?.role !== "admin") {
			router.push("/");
		}
	}, []);

	return (
		<div className="p-4 bg-gray-900 text-white min-h-screen pb-20">
			{children}
		</div>
	);
}
