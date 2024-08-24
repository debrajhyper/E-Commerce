'use client'

import { z } from 'zod';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/axios';
import ProductForm from '@/components/ProductForm';
import { ProductSchema } from '@/utils/FormSchema';
import { useToast } from '@/components/ui/use-toast';
import DashboardTitle from '@/components/DashboardTitle';
import { API_PRODUCTS_URL, API_DEFAULT_ERROR_MESSAGE, SELLER_DASHBOARD_LINK } from '@/constants';

/**
 * AddProduct component
 * 
 * This component renders a form to add a new product
 * It uses the ProductForm component and passes the addProductFormSubmit function as a prop
 */
export default function AddProduct() {
    // get the toast function from the useToast hook
    const { toast } = useToast();

    /**
     * addProductFormSubmit
     * 
     * This function is called when the form is submitted
     * It sets the loading state to true and then calls the API to add a new product
     * Finally, it sets the loading state to false and shows a toast message to the user
     * @param {z.infer<typeof ProductSchema>} data the form data
     * @param {boolean} setLoading a function to set the loading state
     */
    const addProductFormSubmit = async (data: z.infer<typeof ProductSchema>, setLoading: (arg0: boolean) => void) => {
        // set the loading state to true
        setLoading(true);

        // transform the data to the final format
        const finalData = {
            ...data,
            price: parseFloat(data.price),
            discount: parseFloat(data.discount),
        };

        try {
            // call the API to add a new product
            const response = await apiClient.post(API_PRODUCTS_URL, finalData);

            // get the message from the response
            const { message } = response.data

            // show the message to the user using the toast function
            toast({ title: message });
        } catch (err) {
            // handle the error
            const error = err as AxiosError<ErrorResponseData>;

            // show the error message to the user using the toast function
            toast({ title: error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE });
        } finally {
            // set the loading state to false
            setLoading(false);
        }
    }

    // return the JSX
    return (
        <>
            {/* render the DashboardTitle component */}
            <DashboardTitle title="Add New Product" />

            {/* render the ProductForm component, passing the addProductFormSubmit function as a prop */}
            <ProductForm buttonText="Add Product" handleSubmit={addProductFormSubmit} />
        </>
    )
}