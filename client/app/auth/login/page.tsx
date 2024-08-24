'use client'

import { z } from 'zod'
import { useState } from 'react'
import { AxiosError } from 'axios'
import { Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/axios'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { LoginFormSchema } from '@/utils/FormSchema'
import { ErrorAlert } from '@/components/ErrorAlert'
import { useToast } from '@/components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { API_DEFAULT_ERROR_MESSAGE, API_LOGIN_URL, EMPTY_STR, LOGIN_LINK, USER_ROLE_BUYER, USER_ROLE_SELLER } from '@/constants'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'

/**
 * Login page component
 */
export default function LoginPage() {
    /**
     * Auth store
     */
    const { login, getRoleFromToken } = useAuthStore((state) => state)

    /**
     * Form state
     */
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(EMPTY_STR);

    /**
     * Form instance
     */
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: EMPTY_STR,
            password: EMPTY_STR,
        },
    });

    /**
     * Router
     */
    const router = useRouter();

    /**
     * Toast
     */
    const { toast } = useToast();

    /**
     * Handle form submission
     */
    const handleSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
        setLoading(true);
        setError(EMPTY_STR);
        try {
            const response = await apiClient.post(API_LOGIN_URL, data);
            const { message, token } = response.data
            toast({ title: message })
            login(token)
            const role = getRoleFromToken();
            if (role === USER_ROLE_BUYER || role === USER_ROLE_SELLER) {
                document.cookie = `token=${token};`;
                router.push(`/${role}/dashboard`);
            } else {
                router.push(LOGIN_LINK);
            }
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>;
            setError(error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-5">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <ErrorAlert message={error} />}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" {...field} />
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
                                    <Input placeholder="Enter your password" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    )
}
