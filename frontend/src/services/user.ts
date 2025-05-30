import api from "@/config/api";
import jwtManager from "@/helpers/jwtManager";
import { IResponse } from "@/interfaces/response";
import { ITokens } from "@/interfaces/tokens";
import { IUser } from "@/interfaces/user";

const searchResidents = async (q: string) => {
    const res = (await api.get(`/residents/search?q=${q}`)) as IResponse<
        IUser[]
    >;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

const deleteUser = async (id: string) => {
    const res = (await api.delete(`/residents/${id}`)) as IResponse<IUser>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export interface UpdateUserInput {
    id: string;
    data: Partial<IUser>;
}

const updateUser = async (payload: UpdateUserInput) => {
    const res = (await api.put(
        `/residents/${payload.id}`,
        payload.data
    )) as IResponse<IUser>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

const login = async (payload: { email: string; password: string }) => {
    const res = (await api.post("/auth/login", payload)) as IResponse<ITokens>;

    if (res.code === 0) throw new Error(res.msg);
    console.log(res);

    jwtManager.setTokens(res.data.accessToken, res.data.refreshToken);
    const profile = await fetchUserProfile();

    return profile;
};

const register = async (payload: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
}) => {
    console.log("Registering user with payload:", payload);
    const res = (await api.post(
        "/auth/register",
        payload
    )) as IResponse<ITokens>;
    console.log("Response from registration:", res);
    if (res.code === 0) throw new Error(res.msg);

    jwtManager.setTokens(res.data.accessToken, res.data.refreshToken);
    const profile = await fetchUserProfile();

    return profile;
};

const fetchUserProfile = async () => {
    const res = (await api.get("/residents/me/profile")) as IResponse<IUser>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

const getUsers = async () => {
    const res = (await api.get("/residents")) as IResponse<IUser[]>;

    if (res.code === 0) {
        throw new Error(res.msg);
    }

    return res.data;
};

export {
    deleteUser,
    fetchUserProfile,
    getUsers,
    login,
    register,
    searchResidents,
    updateUser,
};
