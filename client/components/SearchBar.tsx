import { useEffect, useState } from 'react';
import { EMPTY_STR } from '@/constants';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * SearchBar component
 * 
 * @param {Object} props - component props
 * @param {Function} props.onSearch - function to call when search form is submitted
 * @returns {JSX.Element} - component JSX
 */
export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
    const [query, setQuery] = useState(EMPTY_STR);

    /**
     * Form submission handler
     * 
     * @param {Object} e - event object
     */
    const handleSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        onSearch(query);
    };

    /**
     * Debounce search function call
     * When user types something in the input field, this useEffect hook will
     * call the onSearch function with the current query value after 300ms of
     * inactivity. This is to prevent calling the onSearch function too many
     * times when the user is typing.
     */
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            onSearch(query);
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 my-5">
            <Input
                type="text"
                placeholder="Search products by name or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-grow"
            />
            <Button type="submit">Search</Button>
        </form>
    );
}