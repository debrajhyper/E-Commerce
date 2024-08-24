import { z } from "zod";
import { USER_ROLE_BUYER, USER_ROLE_SELLER } from "@/constants";

/**
 * Signup form schema
 */
export const SignupFormSchema = z.object({
    /**
     * Email address
     */
    email: z.string().email({
        message: "Invalid email address",
    }),
    /**
     * Password
     */
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
    /**
     * User role (buyer or seller)
     */
    role: z.enum([USER_ROLE_BUYER, USER_ROLE_SELLER], {
        required_error: "You need to select a user role",
        invalid_type_error: "You need to select a user role",
    }).default(USER_ROLE_BUYER),
})

/**
 * Login form schema
 */
export const LoginFormSchema = z.object({
    /**
     * Email address
     */
    email: z.string().email({
        message: "Invalid email address",
    }),
    /**
     * Password
     */
    password: z.string().min(6, {
        message: "Password must be at least 6 characters",
    }),
})

/**
 * Product schema
 */
export const ProductSchema = z.object({
    /**
     * Name
     */
    name: z.string().min(1, "Name is required"),
    /**
     * Category
     */
    category: z.string().min(1, "Category is required"),
    /**
     * Description
     */
    description: z.string().optional(),
    /**
     * Price
     */
    price: z.string().refine((val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed >= 0;
    }, {
        message: "Price must be a positive number",
    }),
    /**
     * Discount
     */
    discount: z.string().refine((val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed >= 0 && parsed <= 100;
    }, {
        message: "Discount must be between 0 and 100",
    }),
})

