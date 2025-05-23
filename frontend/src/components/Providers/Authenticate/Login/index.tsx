import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import useUserStore from "@/store/userStore";
import RegisterModal from "../ReigisterModal";
import { login } from "@/services/user";
import { useMutation } from "@tanstack/react-query";

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(100),
});

const Login = () => {
    const [disabled, setDisabled] = useState(false);
    const { setUser } = useUserStore();
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onChange",
    });

    const mutation = useMutation({
        mutationFn: login,
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
        <div className="h-screen flex items-center justify-center primary-bg">
            <div className="space-y-7 text-center text-white">
                <div className="text-2xl font-black">
                    Quản lý thu phí chung cư
                </div>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) =>
                            mutation.mutate(data)
                        )}
                        className="p-4 text-black rounded-2xl bg-white shadow-2xl space-y-7"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="shadcn"
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
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="shadcn"
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
                            Submit
                        </Button>
                    </form>
                </Form>

                <div className="text-sm font-medium">
                    Chưa có tài khoản? <RegisterModal />
                </div>
            </div>
        </div>
    );
};

export default Login;
