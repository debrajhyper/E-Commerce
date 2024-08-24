'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { BUYER_CART_LINK, BUYER_DASHBOARD_LINK, HOME_LINK, LOGIN_LINK, SELLER_ADD_PRODUCT_LINK, SELLER_DASHBOARD_LINK, SIGNUP_LINK, USER_ROLE_BUYER, USER_ROLE_SELLER } from '@/constants';

/**
 * Header component
 *
 * This component renders the header of the website.
 * It includes the logo, navigation links and login/logout button.
 */
export default function Header() {
    const pathname = usePathname()
    const { isLoggedIn, logout, getRoleFromToken } = useAuthStore(state => state);
    const userRole = getRoleFromToken();

    const router = useRouter();

    /**
     * Handles logout
     *
     * Logs the user out and redirects them to the login page.
     */
    const handleLogout = () => {
        logout();
        router.push(LOGIN_LINK);
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    return (
        <header className="bg-white shadow-md">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href={HOME_LINK} className="text-md md:text-2xl font-extrabold w-fit">E-commerce</Link>
                <div className="space-x-3 md:space-x-4">
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
                                            <Link href={BUYER_CART_LINK} className={`${pathname.startsWith(BUYER_CART_LINK) ? 'text-blue-600' : ''} text-sm md:text-md font-bold hover:underline`}>Cart</Link>
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