import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

/**
 * A component to display and update the quantity of a product
 * @param quantity The current quantity of the product
 * @param onQuantityChange A function to call when the quantity changes
 */
export function ProductCount({ quantity, onQuantityChange }: {
    quantity: number | undefined;
    onQuantityChange: (newQuantity: number) => void;
}) {
    /**
     * Handles decrementing the quantity by 1
     */
    const handleDecrement = () => {
        if (!quantity) return;
        // prevent going below 1
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    /**
     * Handles incrementing the quantity by 1
     */
    const handleIncrement = () => {
        if (!quantity) return;
        // prevent going above 99999
        if (quantity < 99999) {
            onQuantityChange(quantity + 1);
        }
    };

    return (
        <Card className="transition-colors max-w-28">
            <CardContent className="p-1 flex justify-between items-center space-x-1">
                <Button onClick={handleDecrement} variant="ghost" size="icon" className="text-md font-bold w-7 h-fit p-2 py-0.5">
                    -
                </Button>
                {/* Display the current quantity in the middle */}
                <span className="text-sm font-bold ml-0 w-4 text-center">{quantity}</span>
                <Button onClick={handleIncrement} variant="ghost" size="icon" className="text-md font-bold w-7 h-fit p-2 py-0.5">
                    +
                </Button>
            </CardContent>
        </Card>
    )
}