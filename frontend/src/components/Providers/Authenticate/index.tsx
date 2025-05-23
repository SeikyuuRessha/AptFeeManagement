"use client";

import useUserStore from "@/store/userStore";
import { ReactNode, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Login from "./Login";
import jwtManager from "@/helpers/jwtManager";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "@/services/user";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Authenticate = ({ children }: { children: ReactNode }) => {
    const { isLoggedIn, setUser } = useUserStore();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        queryFn: fetchUserProfile,
        enabled: !!jwtManager.getTokens().accessToken,
        retry: false,
    });

    useEffect(() => {
        if (data) setUser(data);
    }, [data]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!hasMounted || isLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError || !isLoggedIn) {
        return <Login />;
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default Authenticate;
