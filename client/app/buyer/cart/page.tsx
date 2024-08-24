'use client';

import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useFetchProducts } from '@/hooks/useFetch';
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
    const { dataArray, setDataArray } = useFetchProducts(API_CART_URL);

    /**
     * Function to remove an item from the cart
     * @param {number | undefined} id - The id of the item to remove
     */
    const removeItemFromCart = async (id: number | undefined) => {
        try {
            const response = await apiClient.delete(`${API_CART_URL}${id}`);
            const { message } = response.data
            toast({ title: message });
            location.reload();
        } catch (err) {
            const error = err as AxiosError<ErrorResponseData>;
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
                        dataArray.map((item: Product) => {
                            const { name, price, quantity, id, description, category, discount, seller_id } = item;
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
                                        <Button variant="destructive" size="sm" onClick={() => removeItemFromCart(id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <div className="text-right mt-12">
                <p className="text-xl font-semibold">Total: ₹{totalPrice.toFixed(2)}</p>
                <Button className="mt-2">Proceed to Checkout</Button>
            </div>
        </div>
    );
};