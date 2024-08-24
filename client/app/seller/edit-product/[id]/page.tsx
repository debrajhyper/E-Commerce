'use client'

import { z } from 'zod';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { ProductSchema } from '@/utils/FormSchema';
import { useFetchProducts } from '@/hooks/useFetch';
import { useToast } from '@/components/ui/use-toast';
import DashboardTitle from '@/components/DashboardTitle';
import { API_DEFAULT_ERROR_MESSAGE, API_PRODUCTS_URL, SELLER_DASHBOARD_LINK } from '@/constants';

/**
 * EditProduct component
 * 
 * This component renders a form to edit an existing product
 * It uses the ProductForm component and passes the addProductFormSubmit function as a prop
 * The addProductFormSubmit function is called when the form is submitted
 * It sets the loading state to true and then calls the API to edit the product
 * Finally, it sets the loading state to false and shows a toast message to the user
 */
export default function EditProduct({ params }: { params: { id: string } }) {
    const API_EDIT_PRODUCT_URL = `${API_PRODUCTS_URL}${params.id}`;
    const { data } = useFetchProducts(API_EDIT_PRODUCT_URL);
    const { toast } = useToast();
    const router = useRouter();

    /**
     * addProductFormSubmit
     * 
     * This function is called when the form is submitted
     * It sets the loading state to true and then calls the API to edit the product
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
            // call the API to edit the product
            const response = await apiClient.put(API_EDIT_PRODUCT_URL, finalData);

            // get the message from the response
            const { message } = response.data

            // show the message to the user using the toast function
            toast({ title: message });

            // redirect to the seller dashboard
            router.push(SELLER_DASHBOARD_LINK);
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

    return (
        <>
            <DashboardTitle title="Edit Product" />
            <ProductForm initialProduct={data} handleSubmit={addProductFormSubmit} buttonText="Edit Product" />
        </>
    )
}