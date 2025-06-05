"use client";

import { useCallback, useState, useMemo } from "react";
import { toast } from "sonner";
import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

import Skeleton from "@/components/Skeleton";
import {
    deleteUser,
    getUsers,
    updateUser,
    UpdateUserInput,
} from "@/services/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import UserRow from "./UserRow";

const AdminUsersPage = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const { isLoading, data } = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
    });
    const queryClient = useQueryClient();

    // Filter users based on search query
    const filteredUsers = useMemo(() => {
        if (!data) return [];
        if (!searchQuery.trim()) return data;

        return data.filter(
            (user) =>
                user.fullName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.phone.includes(searchQuery) ||
                user.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [data, searchQuery]);

    const handleSuccess = (msg: string) => {
        toast.success(msg);
        queryClient.invalidateQueries({ queryKey: ["users"] });
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => deleteUser(id),
        onSuccess: () => handleSuccess("Xóa người dùng thành công!"),
        onError: (error) => toast.error(error.message),
    });

    const updateMutation = useMutation({
        mutationFn: (payload: UpdateUserInput) => updateUser(payload),
        onSuccess: () => handleSuccess("Cập nhật người dùng thành công!"),
        onError: (error) => toast.error(error.message),
    });

    const handleDelete = useCallback((id: string) => {
        deleteMutation.mutate(id);
    }, []);

    const handleUpdate = useCallback((payload: UpdateUserInput) => {
        updateMutation.mutate(payload);
    }, []);

    return (
        <div className="space-y-7">
            <h1 className="text-3xl font-bold">Quản lý người dùng</h1>

            {/* Search Bar */}
            <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                <TextField
                    fullWidth
                    label="Tìm kiếm người dùng"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm theo tên, email, số điện thoại hoặc chức vụ..."
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "white",
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "action.active" }} />
                            </InputAdornment>
                        ),
                    }}
                />
            </div>

            <div className="text-center">
                <div className="flex flex-wrap bg-gray-200 font-semibold text-gray-700 min-h-[50px] items-center">
                    <div className="flex-1 hidden md:block p-4 border border-gray-300">
                        ID
                    </div>
                    <div className="flex-1 p-4 border border-gray-300">
                        Họ và tên
                    </div>
                    <div className="flex-1 p-4 border border-gray-300">
                        Số điện thoại
                    </div>
                    <div className="flex-1 hidden md:block p-4 border border-gray-300">
                        Email
                    </div>
                    <div className="flex-1 hidden md:block p-4 border border-gray-300">
                        Chức vụ
                    </div>
                    <div className="flex-1 p-4 border border-gray-300">
                        Hành động
                    </div>
                </div>

                {isLoading
                    ? new Array(10)
                          .fill(null)
                          .map((_, index) => (
                              <Skeleton key={index} className="h-32" />
                          ))
                    : filteredUsers &&
                      filteredUsers.map((user) => (
                          <UserRow
                              key={user.id}
                              {...user}
                              onDelete={handleDelete}
                              onUpdate={handleUpdate}
                              deleteDisabled={deleteMutation.isPending}
                              updateDisabled={updateMutation.isPending}
                              updateSuccess={updateMutation.isSuccess}
                          />
                      ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;
