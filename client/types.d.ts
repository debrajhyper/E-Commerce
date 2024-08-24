type ErrorResponseData = {
    message?: string;
    error: string;
}

type Product = {
    id?: number;
    seller_id?: number;
    quantity?: number,
    name: string,
    category: string,
    description: string,
    price: string,
    discount: string,
}