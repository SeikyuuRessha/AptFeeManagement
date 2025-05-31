import { useState, useEffect } from "react";
import {
    getInvoices,
    getPayments,
    Invoice,
    Payment,
    getInvoiceDetails,
} from "@/services/invoice";
import { getApartments, Apartment, getBuildings } from "@/services/building";
import { getUsers } from "@/services/user";

// Data interfaces for reports
export interface FinancialData {
    revenue: {
        labels: string[];
        monthly: number[];
    };
    debt: Array<{
        id: string;
        resident: string;
        amount: number;
        months: number;
        apartment: string;
    }>;
    totalRevenue: number;
    monthlyGrowth: number;
}

export interface ApartmentData {
    occupancy: {
        occupied: number;
        vacant: number;
        total: number;
        occupancyRate: number;
    };
    rentDistribution: {
        labels: string[];
        data: number[];
        averageRent: number;
    };
    apartmentDetails: Array<{
        id: string;
        number: string;
        buildingId: string;
        buildingName: string;
        residentName: string | null;
        monthlyRent: number;
        status: "occupied" | "vacant";
        size: number;
        rooms: number;
    }>;
    statistics: {
        totalBuildings: number;
        averageApartmentsPerBuilding: number;
        vacancyTrend: "increasing" | "decreasing" | "stable";
        totalMonthlyRevenue: number;
        potentialRevenueLoss: number;
    };
}

// New interfaces for additional reports
export interface ServiceUsageData {
    serviceName: string;
    totalSubscriptions: number;
    totalRevenue: number;
    averageUsage: number;
    activeSubscriptions: number;
    inactiveSubscriptions: number;
}

export interface BuildingOccupancyData {
    id: string;
    name: string;
    address: string;
    totalApartments: number;
    occupiedApartments: number;
    vacantApartments: number;
    occupancyRate: number;
    totalRevenue: number;
    averageRent: number;
}

export interface PaymentAnalyticsData {
    month: string;
    totalPayments: number;
    totalAmount: number;
    averagePayment: number;
    onTimePayments: number;
    latePayments: number;
    paymentMethods: {
        [key: string]: number;
    };
}

export const useReportsData = (selectedReport: string, dateRange: string) => {
    const [financialData, setFinancialData] = useState<FinancialData | null>(
        null
    );
    const [apartmentData, setApartmentData] = useState<ApartmentData | null>(
        null
    );
    const [serviceUsageData, setServiceUsageData] = useState<
        ServiceUsageData[] | null
    >(null);
    const [buildingOccupancyData, setBuildingOccupancyData] = useState<
        BuildingOccupancyData[] | null
    >(null);
    const [paymentAnalyticsData, setPaymentAnalyticsData] = useState<
        PaymentAnalyticsData[] | null
    >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReportsData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all required data
                const [
                    invoices,
                    payments,
                    apartments,
                    users,
                    buildings,
                    invoiceDetails,
                ] = await Promise.all([
                    getInvoices(),
                    getPayments(),
                    getApartments(),
                    getUsers(),
                    getBuildings(),
                    getInvoiceDetails(),
                ]); // Process financial data
                const monthlyRevenue = new Array(12).fill(0);

                // Calculate revenue from payments
                payments.forEach((payment: Payment) => {
                    const month = new Date(payment.paymentDate).getMonth();
                    monthlyRevenue[month] += Number(payment.amount) || 0;
                });

                // Calculate debt from unpaid invoices (both PENDING and OVERDUE)
                const debtData = invoices
                    .filter((invoice: Invoice) => {
                        return (
                            invoice.status === "PENDING" ||
                            invoice.status === "OVERDUE"
                        );
                    })
                    .map((invoice: Invoice) => {
                        const apartment = apartments.find(
                            (a) => a.id === invoice.apartmentId
                        );
                        const user = users.find(
                            (u) => u.id === apartment?.residentId
                        );

                        // Calculate overdue months, ensure it's not negative
                        const today = new Date();
                        const dueDate = new Date(invoice.dueDate);
                        const overdueDays = Math.max(
                            0,
                            Math.floor(
                                (today.getTime() - dueDate.getTime()) /
                                    (1000 * 60 * 60 * 24)
                            )
                        );
                        const overdueMonths = Math.floor(overdueDays / 30);

                        return {
                            id: invoice.id,
                            resident: user?.fullName || "Unknown",
                            amount: Number(invoice.totalAmount) || 0,
                            months: overdueMonths,
                            apartment: apartment
                                ? `${apartment.buildingId}-${apartment.number}`
                                : "Unknown",
                        };
                    });

                // Process service usage data for new report
                const serviceUsageMap = new Map<
                    string,
                    {
                        name: string;
                        totalSubscriptions: number;
                        totalRevenue: number;
                        totalUsage: number;
                        usageCount: number;
                        activeSubscriptions: number;
                    }
                >();

                // Aggregate service data from invoice details
                invoiceDetails.forEach((detail) => {
                    const serviceName =
                        detail.subscription?.service?.name || "Unknown Service";
                    const existing = serviceUsageMap.get(serviceName) || {
                        name: serviceName,
                        totalSubscriptions: 0,
                        totalRevenue: 0,
                        totalUsage: 0,
                        usageCount: 0,
                        activeSubscriptions: 0,
                    };

                    existing.totalRevenue += Number(detail.total) || 0;
                    existing.totalUsage += detail.quantity || 0;
                    existing.usageCount += 1;
                    serviceUsageMap.set(serviceName, existing);
                });

                const serviceUsageArray: ServiceUsageData[] = Array.from(
                    serviceUsageMap.values()
                ).map((service) => ({
                    serviceName: service.name,
                    totalSubscriptions: service.usageCount,
                    totalRevenue: service.totalRevenue,
                    averageUsage:
                        service.usageCount > 0
                            ? service.totalUsage / service.usageCount
                            : 0,
                    activeSubscriptions: service.usageCount, // Simplified for now
                    inactiveSubscriptions: 0, // Simplified for now
                }));

                setServiceUsageData(serviceUsageArray);

                // Process building occupancy data
                const buildingOccupancyMap = new Map<
                    string,
                    {
                        building: any;
                        apartments: any[];
                        totalRevenue: number;
                    }
                >();

                // Group apartments by building
                apartments.forEach((apartment) => {
                    const building = buildings.find(
                        (b) => b.id === apartment.buildingId
                    );
                    if (building) {
                        const existing = buildingOccupancyMap.get(
                            building.id
                        ) || {
                            building,
                            apartments: [],
                            totalRevenue: 0,
                        };
                        existing.apartments.push(apartment);
                        buildingOccupancyMap.set(building.id, existing);
                    }
                });

                // Calculate revenue per building from payments
                payments.forEach((payment) => {
                    const invoice = invoices.find(
                        (inv) => inv.id === payment.invoiceId
                    );
                    if (invoice) {
                        const apartment = apartments.find(
                            (apt) => apt.id === invoice.apartmentId
                        );
                        if (apartment) {
                            const existing = buildingOccupancyMap.get(
                                apartment.buildingId
                            );
                            if (existing) {
                                existing.totalRevenue +=
                                    Number(payment.amount) || 0;
                            }
                        }
                    }
                });
                const buildingOccupancyArray: BuildingOccupancyData[] =
                    Array.from(buildingOccupancyMap.values()).map(
                        ({
                            building,
                            apartments: buildingApartments,
                            totalRevenue,
                        }) => {
                            const occupiedApartments =
                                buildingApartments.filter(
                                    (apt) =>
                                        apt.residentId &&
                                        apt.residentId.trim() !== ""
                                );
                            const vacantApartments = buildingApartments.filter(
                                (apt) =>
                                    !apt.residentId ||
                                    apt.residentId.trim() === ""
                            );
                            const occupancyRate =
                                buildingApartments.length > 0
                                    ? (occupiedApartments.length /
                                          buildingApartments.length) *
                                      100
                                    : 0;
                            const averageRent =
                                occupiedApartments.length > 0
                                    ? totalRevenue / occupiedApartments.length
                                    : 0;

                            return {
                                id: building.id,
                                name: building.name,
                                address: building.address,
                                totalApartments: buildingApartments.length,
                                occupiedApartments: occupiedApartments.length,
                                vacantApartments: vacantApartments.length,
                                occupancyRate,
                                totalRevenue,
                                averageRent,
                            };
                        }
                    );

                setBuildingOccupancyData(buildingOccupancyArray);

                // Process payment analytics data
                const monthlyPaymentMap = new Map<
                    string,
                    {
                        totalPayments: number;
                        totalAmount: number;
                        onTimePayments: number;
                        latePayments: number;
                    }
                >();

                payments.forEach((payment) => {
                    const paymentDate = new Date(payment.paymentDate);
                    const monthKey = `${paymentDate.getFullYear()}-${String(
                        paymentDate.getMonth() + 1
                    ).padStart(2, "0")}`;

                    const existing = monthlyPaymentMap.get(monthKey) || {
                        totalPayments: 0,
                        totalAmount: 0,
                        onTimePayments: 0,
                        latePayments: 0,
                    };

                    existing.totalPayments += 1;
                    existing.totalAmount += Number(payment.amount) || 0;

                    // Determine if payment was on time (simplified logic)
                    const invoice = invoices.find(
                        (inv) => inv.id === payment.invoiceId
                    );
                    if (invoice) {
                        const dueDate = new Date(invoice.dueDate);
                        if (paymentDate <= dueDate) {
                            existing.onTimePayments += 1;
                        } else {
                            existing.latePayments += 1;
                        }
                    }

                    monthlyPaymentMap.set(monthKey, existing);
                });

                const paymentAnalyticsArray: PaymentAnalyticsData[] =
                    Array.from(monthlyPaymentMap.entries())
                        .map(([monthKey, data]) => ({
                            month: monthKey,
                            totalPayments: data.totalPayments,
                            totalAmount: data.totalAmount,
                            averagePayment:
                                data.totalPayments > 0
                                    ? data.totalAmount / data.totalPayments
                                    : 0,
                            onTimePayments: data.onTimePayments,
                            latePayments: data.latePayments,
                            paymentMethods: {}, // Simplified for now
                        }))
                        .sort((a, b) => a.month.localeCompare(b.month));

                setPaymentAnalyticsData(paymentAnalyticsArray);
                const totalRevenue = monthlyRevenue.reduce(
                    (sum, month) => sum + month,
                    0
                );

                const currentMonth = monthlyRevenue[new Date().getMonth()];
                const previousMonth =
                    monthlyRevenue[new Date().getMonth() - 1] || 0;
                const monthlyGrowth =
                    previousMonth > 0
                        ? ((currentMonth - previousMonth) / previousMonth) * 100
                        : 0;
                setFinancialData({
                    revenue: {
                        labels: [
                            "Jan",
                            "Feb",
                            "Mar",
                            "Apr",
                            "May",
                            "Jun",
                            "Jul",
                            "Aug",
                            "Sep",
                            "Oct",
                            "Nov",
                            "Dec",
                        ],
                        monthly: monthlyRevenue,
                    },
                    debt: debtData,
                    totalRevenue,
                    monthlyGrowth,
                }); // Process apartment data
                const occupiedApartments = apartments.filter(
                    (apt) => apt.residentId && apt.residentId.trim() !== ""
                );
                const vacantApartments = apartments.filter(
                    (apt) => !apt.residentId || apt.residentId.trim() === ""
                );

                const occupancyRate =
                    apartments.length > 0
                        ? (occupiedApartments.length / apartments.length) * 100
                        : 0; // Calculate rent statistics
                const totalMonthlyRevenue = occupiedApartments.reduce(
                    (sum, apt) => {
                        // Simulate rent calculation - in real app this would come from lease data
                        const baseRent = 1000000; // 1M VND base rent
                        const rentMultiplier = 1; // Default multiplier since size not available
                        return sum + baseRent * rentMultiplier;
                    },
                    0
                );

                const averageRent =
                    occupiedApartments.length > 0
                        ? totalMonthlyRevenue / occupiedApartments.length
                        : 0;
                const potentialRevenueLoss = vacantApartments.reduce(
                    (sum, apt) => {
                        const baseRent = 1000000;
                        const rentMultiplier = 1; // Default multiplier since size not available
                        return sum + baseRent * rentMultiplier;
                    },
                    0
                ); // Get building information for apartment details
                const buildingMap = new Map(buildings.map((b) => [b.id, b]));
                const userMap = new Map(users.map((u) => [u.id, u]));
                const apartmentDetails = apartments.map((apt) => {
                    const building = buildingMap.get(apt.buildingId);
                    const isOccupied =
                        apt.residentId && apt.residentId.trim() !== "";
                    const resident = isOccupied
                        ? userMap.get(apt.residentId!)
                        : null;
                    const baseRent = 1000000;
                    const rentMultiplier = 1;

                    return {
                        id: apt.id,
                        number: apt.number || apt.id.slice(-4) || "N/A",
                        buildingId: apt.buildingId,
                        buildingName: building?.name || "Unknown Building",
                        residentName: resident?.fullName || null,
                        monthlyRent: baseRent * rentMultiplier,
                        status: isOccupied
                            ? ("occupied" as const)
                            : ("vacant" as const),
                        size: 50,
                        rooms: 2,
                    };
                }); // Calculate statistics
                const buildingCount = new Set(
                    apartments.map((apt) => apt.buildingId)
                ).size;
                const averageApartmentsPerBuilding =
                    buildingCount > 0 ? apartments.length / buildingCount : 0;

                // Simulate vacancy trend (in real app, this would be calculated from historical data)
                const vacancyTrend =
                    occupancyRate > 85
                        ? "decreasing"
                        : occupancyRate < 70
                        ? "increasing"
                        : "stable";
                setApartmentData({
                    occupancy: {
                        occupied: occupiedApartments.length,
                        vacant: vacantApartments.length,
                        total: apartments.length,
                        occupancyRate,
                    },
                    rentDistribution: {
                        labels: [
                            "< 1M VND",
                            "1-2M VND",
                            "2-3M VND",
                            "> 3M VND",
                        ],
                        data: [
                            Math.floor(apartments.length * 0.15),
                            Math.floor(apartments.length * 0.45),
                            Math.floor(apartments.length * 0.3),
                            Math.floor(apartments.length * 0.1),
                        ],
                        averageRent,
                    },
                    apartmentDetails,
                    statistics: {
                        totalBuildings: buildingCount,
                        averageApartmentsPerBuilding,
                        vacancyTrend: vacancyTrend as
                            | "increasing"
                            | "decreasing"
                            | "stable",
                        totalMonthlyRevenue,
                        potentialRevenueLoss,
                    },
                });
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch reports data"
                );
                console.error("Error fetching reports data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReportsData();
    }, [selectedReport, dateRange]);

    return {
        financialData,
        apartmentData,
        serviceUsageData,
        buildingOccupancyData,
        paymentAnalyticsData,
        loading,
        error,
    };
};
