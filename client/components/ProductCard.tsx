import { useState } from "react";
import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { ProductCount } from "./ProductCount";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { USER_ROLE_BUYER } from '../constants/index';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { API_CART_URL, API_DEFAULT_ERROR_MESSAGE, API_PRODUCTS_URL, SELLER_EDIT_PRODUCT_LINK, USER_ROLE_SELLER } from "@/constants";

/**
 * Component for rendering a single product card
 * @param {Object} product - the product data
 * @returns {ReactElement} The rendered product card component
 */
export default function ProductCard({ product }: { product: Product }) {
    const { id, name, category, description, price, discount } = product;

    // get the current user's role from the token
    const { getRoleFromToken } = useAuthStore(state => state);
    const role = getRoleFromToken();

    // state for the quantity input
    const [quantity, setQuantity] = useState<number>(1);

    // router for navigating to other pages
    const router = useRouter();

    // toast for displaying messages
    const { toast } = useToast();

    /**
     * Handles deleting a product
     * @param {number | undefined} id - the product id
     */
    const handleDelete = async (id: number | undefined) => {
        try {
            // call the API to delete the product
            const response = await apiClient.delete(`${API_PRODUCTS_URL}${id}`);
            const { message } = response.data

            // show the message to the user using the toast function
            toast({ title: message });

            // reload the page
            location.reload();
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>;

            // show the error message to the user using the toast function
            toast({ title: error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE });
        }
    }

    /**
     * Handles adding a product to the cart
     * @param {number | undefined} productId - the product id
     * @param {number} quantity - the quantity of the product to add to the cart
     */
    const handleAddToCart = async (productId: number | undefined, quantity: number) => {
        try {
            // call the API to add the product to the cart
            const response = await apiClient.post(API_CART_URL, { productId, quantity });
            const { message } = response.data

            // show the message to the user using the toast function
            toast({ title: message });
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>;

            // show the error message to the user using the toast function
            toast({ title: error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE });
        }
    }

    {/*
        The card component for the product item
        It contains the product name, category, description, price, discount, and buttons to edit or delete the product
    */}
    return (
        <Card className="w-full max-w-sm mx-auto flex flex-col justify-end items-start p-4" >
            {/*
                The content of the card, contains the product name, category, description, price, and discount
            */}
            < CardContent className="w-full h-full px-0" >
                {/*
                    The product name
                */}
                <h3 title={name} className="text-2xl font-extrabold line-clamp-1" > {name}</h3 >
                {/*
                    The product category
                */}
                <p className="text-sm text-gray-500" > {category}</p >
                {/*
                    The product description
                */}
                <p className="mt-2" > {description}</p >
                {/*
                    The product price
                */}
                <p className="mt-2 text-lg font-bold" >₹{price}</p >
                {/*
                    The product discount
                */}
                <p className="text-xs font-semibold text-green-600" > {discount} % off</p >
            </CardContent >
            {/*
                The footer of the card, contains the buttons to edit or delete the product
            */}
            <CardFooter className={`p-0 w-full flex ${role === USER_ROLE_SELLER ? 'justify-end' : 'justify-between'}  mt-auto ml-auto gap-4`
            }>
                {/*
                    If the user is a seller, show the edit and delete buttons
                */}
                {
                    role === USER_ROLE_SELLER && (
                        <>
                            {/*
                                The edit button
                            */}
                            <Button onClick={() => router.push(`${SELLER_EDIT_PRODUCT_LINK}/${id}`)}>Edit</Button>
                            {/*
                                The delete button
                            */}
                            <Button variant="destructive" onClick={() => handleDelete(id)}>Delete</Button>
                        </>
                    )
                }
                {/*
                        If the user is a buyer, show the add to cart button
                    */}
                {
                    role === USER_ROLE_BUYER && (
                        <>
                            {/*
                                The add to cart button
                            */}
                            <ProductCount quantity={quantity} onQuantityChange={setQuantity} />
                            <Button onClick={() => handleAddToCart(id, quantity)}>Add to Cart</Button>
                        </>
                    )
                }
            </CardFooter >
        </Card >
    )
}