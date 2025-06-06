import Modal from "@/components/Modal";
import { useDisclosure } from "@/hooks/useDisclosure";
import useUserStore from "@/store/userStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { register } from "@/services/user";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
    fullName: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
});

const RegisterModal = () => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [disabled, setDisabled] = useState(false);
    const { setUser } = useUserStore();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            fullName: "",
            phone: "",
        },
        mode: "onChange",
    });

    const mutation = useMutation({
        mutationFn: register,
        onMutate: () => setDisabled(true),
        onSettled: () => setDisabled(false),
        onSuccess: (user) => {
            setUser(user);
        },
        onError: (error: any) => {
            toast(error.message || "Đăng nhập thất bại");
        },
    });

    return (
        <>
            <button onClick={onOpen} className="underline font-bold">
                Đăng ký
            </button>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            mutation.mutate(data)
                        )}
                        className="text-black space-y-7 text-left"
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
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Nhập mật khẩu"
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

                        <Button
                            className="w-full primary-bg"
                            disabled={disabled}
                            type="submit"
                        >
                            Đăng ký
                        </Button>
                    </form>
                </Form>
            </Modal>
        </>
    );
};

export default RegisterModal;
