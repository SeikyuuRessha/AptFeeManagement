import { FC, memo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Role } from "@/enums/role";
import { useDisclosure } from "@/hooks/useDisclosure";
import { UpdateUserInput } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";

interface UpdateModalProps {
    updateDisabled: boolean;
    updateSuccess: boolean;
    onUpdate: (payload: UpdateUserInput) => void;
    data: {
        email: string;
        fullName: string;
        phone: string;
        role: Role;
    };
    id: string;
}

const formSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    role: z.enum(["admin", "resident"]),
});

const UpdateModal: FC<UpdateModalProps> = ({
    updateDisabled,
    updateSuccess,
    onUpdate,
    data,
    id,
}) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: data,
        mode: "onChange",
    });

    useEffect(() => {
        if (updateSuccess) {
            onOpenChange();
        }
    }, []);

    return (
        <>
            <button
                disabled={updateDisabled}
                className="p-1 rounded-full text-green-500 hover:bg-green-500 hover:text-white transition"
                onClick={onOpen}
            >
                <Edit fontSize="small" />
            </button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <Form {...form}>
                    <form
                        className="space-y-4 text-black"
                        onSubmit={form.handleSubmit((data) =>
                            onUpdate({
                                id,
                                data: {
                                    ...data,
                                    role: data.role as Role,
                                },
                            })
                        )}
                    >
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Họ và tên</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập họ và tên"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập email"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số điện thoại</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập số điện thoại"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chức vụ</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Chọn chức vụ"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={updateDisabled}
                            className="w-full primary-bg"
                        >
                            Cập nhật
                        </Button>
                    </form>
                </Form>
            </Modal>
        </>
    );
};

export default memo(UpdateModal);
