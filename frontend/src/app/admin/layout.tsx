import { ReactNode } from "react";
import RoleGuard from "./components/RoleGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
	return <RoleGuard>{children}</RoleGuard>;
}
