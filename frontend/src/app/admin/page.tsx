"use client";

import { motion } from "motion/react";
import Link from "next/link";

import useUserStore from "@/store/userStore";
import {
    Apartment,
    Payment,
    People,
    Report,
    MiscellaneousServices,
    Settings,
} from "@mui/icons-material";

import GrowthComparisonChart from "./components/GrowthComparisonChart";

const menuItems = [
    { text: "Quản lý người dùng", icon: <People />, path: "/admin/users" },
    {
        text: "Quản lý căn hộ",
        icon: <Apartment />,
        path: "/admin/apartments",
    },
    {
        text: "Quản lý thanh toán",
        icon: <Payment />,
        path: "/admin/payments",
    },
    {
        text: "Cài đặt hệ thống",
        icon: <Settings />,
        path: "/admin/settings",
    },
    { text: "Báo cáo thống kê", icon: <Report />, path: "/admin/reports" },
    {
        text: "Quản lý dịch vụ",
        icon: <MiscellaneousServices />,
        path: "/admin/services",
    },
];

const AdminPage = () => {
    const { user } = useUserStore();

    return (
        <div className="space-y-7">
            <div className="grid grid-cols-2">
                <GrowthComparisonChart />
            </div>

            <div className="grid grid-cols-3 gap-4">
                {menuItems.map((item) => (
                    <Link href={item.path} key={item.path}>
                        <motion.button
                            whileHover={{
                                translateY: -8,
                            }}
                            className="flex items-center w-full font-semibold text-white primary-bg gap-3 transition-colors hover:border-green-500 p-4 rounded-2xl shadow-md"
                        >
                            {item.icon}
                            {item.text}
                        </motion.button>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
