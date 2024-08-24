import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { EMPTY_STR } from '@/constants'
import { useForm } from 'react-hook-form'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ProductSchema } from '@/utils/FormSchema'
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * Type for the ProductForm component props
 */
type ProductFormProps = {
    buttonText: string,
    initialProduct?: Product | {},
    handleSubmit: (data: z.infer<typeof ProductSchema>, setLoading: (arg0: boolean) => void) => Promise<void>
}

/**
 * ProductForm component
 * 
 * @param {ProductFormProps} props - component props
 * @returns {JSX.Element} - component JSX
 */
export default function ProductForm({ initialProduct, handleSubmit, buttonText }: ProductFormProps) {
    // set the initial loading state to false
    const [loading, setLoading] = useState<boolean>(false);

    // create a form using react-hook-form
    // the form will be validated using the ProductSchema
    // the default values will be set to the defaultValues if it is provided
    // otherwise, the default values are set to an empty string
    const form = useForm<z.infer<typeof ProductSchema>>({
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            name: EMPTY_STR,
            category: EMPTY_STR,
            description: EMPTY_STR,
            price: EMPTY_STR,
            discount: EMPTY_STR
        },
    });

    // reset the form values when the initialProduct prop changes
    useEffect(() => {
        // this is necessary to update the form values when the component is mounted
        // and the initialProduct prop is not empty for edit component
        form.reset(initialProduct)
    }, [initialProduct])

    /**
     * Form submission handler
     * 
     * @param {z.infer<typeof ProductSchema>} data - form data
     */
    const formSubmit = async (data: z.infer<typeof ProductSchema>) => {
        await handleSubmit(data, setLoading);
        form.reset();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-2 h-full">
                {/* Name field */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                {/* Input field for product name */}
                                <Input placeholder="Enter product name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Category field */}
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                {/* Category dropdown list */}
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                </FormControl>
                                {/* Category options */}
                                <SelectContent>
                                    <SelectItem value="clothes">Clothes</SelectItem>
                                    <SelectItem value="shoes">Shoes</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Description field */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                {/* Text area for product description */}
                                <Textarea
                                    placeholder="Tell us a little bit about the product"
                                    className="resize-none"
                                    rows={4}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Price field */}
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price(₹)</FormLabel>
                            <FormControl>
                                {/* Input field for product price */}
                                <Input type="number" min={0} step={0.01} placeholder="Enter product price" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Discount field */}
                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discount(%)</FormLabel>
                            <FormControl>
                                {/* Input field for product discount */}
                                <Input type="number" min={0} max={100} placeholder="Enter product discount" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Submit button */}
                <Button>
                    {/* Loading animation */}
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {/* Button text */}
                    {buttonText}
                </Button>
            </form>
        </Form>
    )
}