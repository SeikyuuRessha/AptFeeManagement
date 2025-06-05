"use client";

import { motion } from "motion/react";
import Link from "next/link";

import useUserStore from "@/store/userStore";
import {
    Apartment,
    Payment,
    People,
    HouseOutlined,
    Report,
    MiscellaneousServices,
    Subscriptions,
    Description,
    Notifications,
} from "@mui/icons-material";

import GrowthComparisonChart from "./components/GrowthComparisonChart";

const menuItems = [
    { text: "Quản lý người dùng", icon: <People />, path: "/admin/users" },
    {
        text: "Quản lý căn hộ",
        icon: <HouseOutlined />,
        path: "/admin/apartments",
    },
    {
        text: "Quản lý thanh toán",
        icon: <Payment />,
        path: "/admin/payments",
    },
    {
        text: "Quản lý tòa nhà",
        icon: <Apartment />,
        path: "/admin/buildings",
    },
    {
        text: "Quản lý dịch vụ",
        icon: <MiscellaneousServices />,
        path: "/admin/services",
    },
    {
        text: "Quản lý đăng ký",
        icon: <Subscriptions />,
        path: "/admin/subscriptions",
    },
    {
        text: "Quản lý hợp đồng",
        icon: <Description />,
        path: "/admin/contracts",
    },
    {
        text: "Quản lý thông báo",
        icon: <Notifications />,
        path: "/admin/notifications",
    },
    { text: "Báo cáo thống kê", icon: <Report />, path: "/admin/reports" },
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
