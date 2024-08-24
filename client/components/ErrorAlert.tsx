import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * ErrorAlert
 *
 * A component for displaying errors in a user-friendly format.
 *
 * @param {string} [message] - The error message to display.
 * @param {string} [description] - A longer description of the error.
 */
export function ErrorAlert({ message, description }: { message?: string; description?: string }) {
    return (
        <Alert
            // The destructive variant is red and has a bold border.
            variant="destructive"
            // Add some margin to the top and bottom of the alert.
            className="my-2 py-3 flex items-center bg-red-200/50"
        >
            <AlertCircle className="h-4 -mt-1" />
            <AlertTitle className="mb-0">{message}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
        </Alert>
    )
}