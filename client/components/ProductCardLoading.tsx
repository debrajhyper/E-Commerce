import { Skeleton } from "@/components/ui/skeleton";

/**
 * A loading skeleton for the product card component.
 */
export default function ProductCardLoading() {
    return (
        <div className="w-full max-w-sm flex flex-col justify-end items-start">
            {/* Product info section */}
            <div className="p-4 w-full flex flex-col gap-1">
                {/* Product name */}
                <Skeleton className="h-[25px] w-full" />
                {/* Product category */}
                <Skeleton className="h-[10px] w-8/12" />
                {/* Product description */}
                <Skeleton className="h-[60px] w-12/12 mt-2" />
                {/* Product price and discount */}
                <Skeleton className="h-[14px] w-10/12 mt-2" />
                {/* Product rating */}
                <Skeleton className="h-[8px] w-5/12" />
            </div>
            {/* Actions section */}
            <div className="flex justify-between mt-auto ml-auto gap-4">
                {/* Edit button */}
                <Skeleton className="h-[35px] w-[58px] rounded-md" />
                {/* Delete button */}
                <Skeleton className="h-[35px] w-[75px] rounded-md" />
            </div>
        </div>
    )
}