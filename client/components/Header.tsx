'use client'

import Link from 'next/link';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { apiClient } from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { API_CART_COUNT_URL, BUYER_CART_LINK, BUYER_DASHBOARD_LINK, HOME_LINK, LOGIN_LINK, SELLER_ADD_PRODUCT_LINK, SELLER_DASHBOARD_LINK, SIGNUP_LINK, USER_ROLE_BUYER, USER_ROLE_SELLER } from '@/constants';

/**
 * Header component
 *
 * This component renders the header of the website.
 * It includes the logo, navigation links and login/logout button.
 */
export default function Header() {
    // Get the user's login state and role from the auth store
    const { isLoggedIn, logout, getRoleFromToken } = useAuthStore(state => state);

    // Get the cart item count and the function to update it from the cart store
    const { cartItemCount, updateCartItemCount } = useCartStore(state => state);

    // Get the user's role from the token
    const userRole = getRoleFromToken();

    // Get the current pathname from the router
    const pathname = usePathname();

    // Get the router instance for navigating to other pages
    const router = useRouter();

    /**
     * Fetch data from the API to get the cart item count
     * and update the cart item count in the store
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                /**
                 * Call the API to get the cart item count
                 */
                const response = await apiClient.get(API_CART_COUNT_URL);

                /**
                 * Store the response data in the store
                 */
                updateCartItemCount(response?.data?.cartItemCount);
            } catch (err) {
                /**
                 * Handle the error
                 */
                const error = err as AxiosError<ErrorResponseData>;
            }
        };

        /**
         * Call the fetchData function
         */
        fetchData();
    }, [])

    /**
     * Handles logout
     *
     * Logs the user out and redirects them to the login page.
     */
    const handleLogout = () => {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        logout();
        router.push(LOGIN_LINK);
    }

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href={HOME_LINK} className="text-md md:text-2xl font-extrabold w-fit">E-commerce</Link>
                <div className="space-x-3 md:space-x-4 relative">
                    {
                        isLoggedIn ? (
                            <>
                                {
                                    // If the user is a seller, show the seller dashboard and add product links
                                    userRole === USER_ROLE_SELLER && (
                                        <>
                                            <Link href={SELLER_DASHBOARD_LINK} className={`${pathname.startsWith(SELLER_DASHBOARD_LINK) ? 'text-blue-600' : ''} text-sm md:text-md font-bold hover:underline`}>Dashboard</Link>
                                            <Link href={SELLER_ADD_PRODUCT_LINK} className={`${pathname.startsWith(SELLER_ADD_PRODUCT_LINK) ? 'text-blue-600' : ''} text-sm md:text-md font-bold hover:underline`}>Add Product</Link>
                                        </>
                                    )
                                }
                                {
                                    // If the user is a buyer, show the buyer dashboard, search and cart links
                                    userRole === USER_ROLE_BUYER && (
                                        <>
                                            <Link href={BUYER_DASHBOARD_LINK} className={`${pathname.startsWith(BUYER_DASHBOARD_LINK) ? 'text-blue-600' : ''} text-sm md:text-md font-bold hover:underline`}>Dashboard</Link>
                                            <Link href={BUYER_CART_LINK} className={`${pathname.startsWith(BUYER_CART_LINK) ? 'text-blue-600' : ''} relative text-sm md:text-md font-bold hover:underline`}>
                                                {
                                                    cartItemCount > 0
                                                    && <span className="absolute bottom-3 right-6 rounded-full bg-green-600 w-4 h-4 p-0 m-0 text-white font-mono text-[0.8rem] leading-tight text-center">
                                                        {cartItemCount}
                                                    </span>
                                                }
                                                Cart
                                            </Link>
                                        </>
                                    )
                                }
                                <Button variant="outline" onClick={handleLogout} className='text-sm md:text-md font-bold'>Logout</Button>
                            </>
                        ) : (
                            <>
                                <Link href={LOGIN_LINK}>
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href={SIGNUP_LINK}>
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                </div>
            </nav>
        </header>
    )
}