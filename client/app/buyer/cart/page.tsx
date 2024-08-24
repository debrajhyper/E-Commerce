'use client';

import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { toast } from "@/components/ui/use-toast";
import { useFetchProducts } from '@/hooks/useFetch';
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCount } from '@/components/ProductCount';
import { API_CART_URL, API_DEFAULT_ERROR_MESSAGE } from '@/constants';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * Cart page component
 * 
 * This component renders the cart page, showing all the products in the cart.
 * It also allows the user to update the quantity of each product, remove products from the cart and proceed to checkout.
 * 
 * @returns {JSX.Element} The cart page component
 */
export default function CartPage() {
    // get the data array, set data array function, and loading state from the useFetchProducts hook
    // it fetches the products from the cart API endpoint
    const { dataArray, setDataArray, loading } = useFetchProducts(API_CART_URL);

    // get the update cart item count function from the cart store
    // it is used to update the cart item count in the store
    const { updateCartItemCount } = useCartStore(state => state);

    // get the router from the useRouter hook
    // it is used to navigate to the checkout page
    const router = useRouter();

    /**
     * Function to remove an item from the cart
     * @param {number | undefined} id - The id of the item to remove
     */
    const removeItemFromCart = async (id: number | undefined) => {
        try {
            // call the API to remove the item from the cart
            const response = await apiClient.delete(`${API_CART_URL}${id}`);
            const { message, cartItemCount } = response.data;

            // update the cart item count in the store
            updateCartItemCount(cartItemCount);

            // show a toast message to the user
            toast({ title: message });

            // reload the page to reflect the changes
            location.reload();
        } catch (err) {
            // handle the error
            const error = err as AxiosError<ErrorResponseData>;
            // show an error message to the user if the API call fails
            toast({ title: error?.response?.data?.error || API_DEFAULT_ERROR_MESSAGE });
        }
    };

    /**
     * Function to update the quantity of an item in the cart
     * @param {number | undefined} id - The id of the item to update
     * @param {number} newQuantity - The new quantity of the item
     */
    const updateQuantity = (id: number | undefined, newQuantity: number) => {
        setDataArray(dataArray.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        ));
    };

    /**
     * Calculates the total price of all items in the cart
     * @returns {number} The total price of all items in the cart
     */
    const totalPrice = dataArray.reduce((sum, item) => {
        const quantity = item?.quantity || 1;
        return sum + parseFloat(item.price) * quantity;
    }, 0)

    /**
     * Handles the checkout process
     * Shows a toast message with the total price and a success message
     */
    const handleCheckout = () => {
        // show a toast message with the total price and a success message
        toast({ title: `₹${totalPrice}`, description: "Purchase of above amount successful", variant: "destructive" });
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        loading
                            ? Array.from({ length: 5 }).map((_, index) =>
                                <TableRow key={index}>
                                    <TableCell className="w-fit py-3"><Skeleton className="h-6 w-56" /></TableCell>
                                    <TableCell className="w-fit py-3"><Skeleton className="h-6 w-40" /></TableCell>
                                    <TableCell className="w-fit py-3"><Skeleton className="h-6 w-32" /></TableCell>
                                    <TableCell className="w-fit py-3"><Skeleton className="h-6 w-40" /></TableCell>
                                    <TableCell className="w-fit py-3"><Skeleton className="h-10 w-10" /></TableCell>
                                </TableRow>
                            )
                            : dataArray
                                && dataArray?.length > 0
                                ? dataArray.map((item: Product) => {
                                    const { name, price, quantity, id } = item;
                                    const customQuantity = quantity || 1;
                                    return (
                                        <TableRow key={id}>
                                            <TableCell className="text-2xl font-bold">{name}</TableCell>
                                            <TableCell>₹{price}</TableCell>
                                            <TableCell>
                                                <ProductCount
                                                    quantity={quantity}
                                                    onQuantityChange={(newQuantity: number) => updateQuantity(id, newQuantity)}
                                                />
                                            </TableCell>
                                            <TableCell>₹{(parseFloat(item.price) * customQuantity).toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Button title="Remove from cart" variant="destructive" size="sm" onClick={() => removeItemFromCart(id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                                : <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        Your cart is empty
                                    </TableCell>
                                </TableRow>
                    }
                </TableBody>
            </Table>
            <div className="flex justify-between items-end mt-12">
                <Button variant="outline" className="mt-2" onClick={() => router.back()}>Continue Shopping</Button>
                <div className="text-right">
                    <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
                    <Button className="mt-2" onClick={handleCheckout}>Proceed to Checkout</Button>
                </div>
            </div>
        </div>
    );
};