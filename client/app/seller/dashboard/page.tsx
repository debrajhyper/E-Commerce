'use client'

import { API_PRODUCTS_URL } from '@/constants';
import ProductCard from '@/components/ProductCard';
import { useFetchProducts } from '@/hooks/useFetch';
import DashboardTitle from '@/components/DashboardTitle';
import ProductCardLoading from '@/components/ProductCardLoading';

/**
 * SellerDashboard component
 *
 * This component renders the seller dashboard page
 * It fetches the products from the backend and renders them in a grid
 * If the loading state is true, it renders a loading skeleton
 * If the products array is empty, it renders a message saying no products were found
 */
export default function SellerDashboard() {
    const { dataArray, loading } = useFetchProducts(API_PRODUCTS_URL);

    return (
        <div>
            <DashboardTitle title="Seller Dashboard" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-4">
                {
                    /*
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