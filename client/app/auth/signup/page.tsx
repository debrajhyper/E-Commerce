'use client'

import { z } from "zod";
import Image from 'next/image';
import { useState } from 'react';
import { AxiosError } from 'axios';
import { Loader2 } from "lucide-react";
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import buyerImage from '@/image/buyer.png';
import sellerImage from '@/image/seller.png';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ErrorAlert } from '@/components/ErrorAlert';
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormSchema } from '@/utils/FormSchema';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm, ControllerRenderProps, FieldValues } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { USER_ROLE_BUYER, EMPTY_STR, USER_ROLE_SELLER, API_SIGNUP_URL, API_DEFAULT_ERROR_MESSAGE, LOGIN_LINK } from '@/constants';
/**
 * Signup page component
 */
export default function SignupPage() {
    /**
     * Loading state
     */
    const [loading, setLoading] = useState<boolean>(false);

    /**
     * Error message
     */
    const [error, setError] = useState<string>(EMPTY_STR);

    /**
     * Form instance
     */
    const form = useForm<z.infer<typeof SignupFormSchema>>({
        /**
         * Zod resolver for validation
         */
        resolver: zodResolver(SignupFormSchema),
        /**
         * Default values
         */
        defaultValues: {
            email: EMPTY_STR,
            password: EMPTY_STR,
            role: USER_ROLE_BUYER,
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
    const handleSubmit = async (data: z.infer<typeof SignupFormSchema>) => {
        /**
         * Set loading state to true
         */
        setLoading(true);

        /**
         * Clear error message
         */
        setError(EMPTY_STR);

        try {
            /**
             * Make API request
             */
            const response = await apiClient.post(API_SIGNUP_URL, data);

            /**
             * Show success message
             */
            toast({ title: response.data.message });

            /**
             * Redirect to login page
             */
            router.push(LOGIN_LINK);

            /**
             * Reset form values
             */
            form.reset();
        } catch (err) {
            /**
             * Get error message from response or use default
             */
            const error = err as AxiosError<ErrorResponseData>;
            setError(error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE);
        } finally {
            /**
             * Set loading state to false
             */
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-5">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
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
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Register As</FormLabel>
                                <FormControl>
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-4" {...field}>
                                        <Label htmlFor={USER_ROLE_BUYER} className="radioLabel">
                                            <RadioGroupItem value={USER_ROLE_BUYER} id={USER_ROLE_BUYER} className="sr-only" />
                                            <Image src={buyerImage} alt="buyer image" width={80} height={100} className='h-20 w-auto object-contain' />
                                            Buyer
                                        </Label>
                                        <Label htmlFor={USER_ROLE_SELLER} className="radioLabel">
                                            <RadioGroupItem value={USER_ROLE_SELLER} id={USER_ROLE_SELLER} className="sr-only" />
                                            <Image src={sellerImage} alt="seller image" width={60} height={100} className='h-16 w-auto object-contain' />
                                            Seller
                                        </Label>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                </form>
            </Form>
        </div>
    )
}
