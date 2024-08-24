import { AxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { API_DEFAULT_ERROR_MESSAGE } from "@/constants";

/**
 * useFetchProducts hook
 *
 * This hook fetches the products from the backend
 */
export const useFetchProducts = (url: string) => {
    const { toast } = useToast();
    const [dataArray, setDataArray] = useState<Product[]>([]);// store the products data array
    const [data, setData] = useState<Product | {}>({}); // store the product data
    const [loading, setLoading] = useState<boolean>(false); // store the loading state

    /**
     * fetchData function
     *
     * This function fetches the products from the backend
     */
    const fetchData = async () => {
        setLoading(true); // set the loading state to true
        try {
            const response = await apiClient.get(url); // call the API to get the products
            if (Array.isArray(response?.data)) {
                const sortedData = response.data.sort((a: Product, b: Product) => {
                    return a.name.localeCompare(b.name); // Adjust the sorting criteria as needed
                });
                setDataArray(sortedData); // store the sorted response data array
            } else {
                setData(response?.data); // store the response data
            }
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>; // handle the error
            toast({ title: error?.response?.data?.message || error.response?.data?.error || API_DEFAULT_ERROR_MESSAGE }) // notify the error message
        } finally {
            setLoading(false); // set the loading state to false
        }
    };

    useEffect(() => {
        fetchData(); // call the fetchData function
    }, []);

    return { dataArray, setDataArray, data, setData, loading }; // return the data, loading state and error message
}