import { FC, memo, useState } from "react";

import { IUser } from "@/interfaces/user";
import { UpdateUserInput } from "@/services/user";
import { Delete, Edit, Save, Cancel } from "@mui/icons-material";
import BlockIcon from "@mui/icons-material/Block";

interface UserRowProps extends IUser {
    onDelete: (id: string) => void;
    onUpdate: (payload: UpdateUserInput) => void;
    deleteDisabled: boolean;
    updateDisabled: boolean;
    updateSuccess: boolean;
}

const UserRow: FC<UserRowProps> = ({
    fullName,
    id,
    phone,
    email,
    role,
    onUpdate,
    onDelete,
    deleteDisabled,
    updateDisabled,
    updateSuccess,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        fullName,
        phone,
        email,
        role,
    });

    const handleEdit = () => {
        setEditData({ fullName, phone, email, role });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setEditData({ fullName, phone, email, role });
        setIsEditing(false);
    };

    const handleSave = () => {
        onUpdate({
            id,
            data: editData,
        });
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    if (isEditing) {
        return (
            <div className="flex">
                <div className="flex-1 p-2 hidden md:block line-clamp-1 border">
                    {id.substring(0, 10)}...
                </div>

                <div className="flex-1 p-2 border">
                    <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Họ và tên"
                    />
                </div>

                <div className="flex-1 p-2 border">
                    <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Số điện thoại"
                    />
                </div>

                <div className="flex-1 p-2 hidden md:block border">
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) =>
                            handleInputChange("email", e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:border-blue-500"
                        placeholder="Email"
                    />
                </div>

                <div className="flex-1 p-2 hidden md:block border">
                    <select
                        value={editData.role}
                        onChange={(e) =>
                            handleInputChange("role", e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:border-blue-500 bg-white text-gray-900"
                    >
                        <option
                            value="admin"
                            className="text-gray-900 bg-white"
                        >
                            Quản trị viên
                        </option>
                        <option
                            value="resident"
                            className="text-gray-900 bg-white"
                        >
                            Cư dân
                        </option>
                    </select>
                </div>

                <div className="flex-1 p-2 flex items-center border justify-center gap-1 overflow-y-scroll">
                    <button
                        disabled={updateDisabled}
                        onClick={handleSave}
                        className="p-1 rounded-full text-green-500 hover:bg-green-500 hover:text-white transition disabled:opacity-50"
                        title="Lưu"
                    >
                        <Save fontSize="small" />
                    </button>

                    <button
                        onClick={handleCancel}
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-500 hover:text-white transition"
                        title="Hủy"
                    >
                        <Cancel fontSize="small" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <div className="flex-1 p-2 hidden md:block line-clamp-1 border">
                {id.substring(0, 10)}...
            </div>

            <div className="flex-1 p-2 line-clamp-1 border">{fullName}</div>

            <div className="flex-1 p-2 line-clamp-1 border">{phone}</div>

            <div className="flex-1 p-2 hidden md:block line-clamp-1 border">
                {email}
            </div>

            <div className="flex-1 p-2 hidden md:block line-clamp-1 border">
                <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                        role === "admin"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                >
                    {role === "admin" ? "Admin" : "Resident"}
                </span>
            </div>

            <div className="flex-1 overflow-y-scroll p-2 flex items-center border justify-center gap-1">
                {role !== "admin" && (
                    <>
                        <button
                            onClick={handleEdit}
                            className="p-1 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition"
                            title="Sửa"
                        >
                            <Edit fontSize="small" />
                        </button>

                        <button
                            disabled={deleteDisabled}
                            className="p-1 rounded-full text-orange-500 hover:bg-orange-500 hover:text-white transition disabled:opacity-50"
                            onClick={() => onDelete(id)}
                            title="Xóa"
                        >
                            <Delete fontSize="small" />
                        </button>
                    </>
                )}
                {role === "admin" && (
                    <span className="text-gray-400 text-sm">Không thể sửa</span>
                )}
            </div>
        </div>
    );
};

export default memo(UserRow);
