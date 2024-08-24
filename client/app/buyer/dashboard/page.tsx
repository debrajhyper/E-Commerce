'use client'

import { AxiosError } from 'axios'
import { apiClient } from '@/lib/axios'
import SearchBar from '@/components/SearchBar'
import { toast } from '@/components/ui/use-toast'
import ProductCard from '@/components/ProductCard'
import { useFetchProducts } from '@/hooks/useFetch'
import DashboardTitle from '@/components/DashboardTitle'
import ProductCardLoading from '@/components/ProductCardLoading'
import { API_DEFAULT_ERROR_MESSAGE, API_PRODUCTS_URL } from '@/constants'

/**
 * BuyerDashboard component
 *
 * This component renders the buyer dashboard page
 * It fetches the products from the backend and renders them in a grid
 * If the loading state is true, it renders a loading skeleton
 * If the products array is empty, it renders a message saying no products were found
 */
export default function BuyerDashboard() {
    const { dataArray, setDataArray, loading } = useFetchProducts(API_PRODUCTS_URL);

    /**
     * handleSearch function
     *
     * This function is called when the search bar is submitted
     * It calls the API to fetch the products with the search query and updates the data array
     * If the API call fails, it shows a toast message to the user
     * @param {string} search the search query
     */
    const handleSearch = async (search: string) => {
        try {
            const response = await apiClient.get(`${API_PRODUCTS_URL}?search=${encodeURIComponent(search)}`);
            setDataArray(response.data)
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>;
            toast({ title: error?.response?.data?.message || error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE });
        }
    }

    return (
        <div>
            <DashboardTitle title="Browse Products" />
            <SearchBar onSearch={handleSearch} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                {
                    /**
                     * If the loading state is true, render a loading skeleton
                     * Otherwise, render the products in a grid
                     */
                    loading
                        ? Array.from({ length: 8 }).map((_, index) => <ProductCardLoading key={index} />)
                        : dataArray
                            && dataArray?.length > 0
                            ? dataArray?.map(product => <ProductCard key={product.id} product={product} />)
                            : <p>No products found</p>
                }
            </div>
        </div>
    )
}