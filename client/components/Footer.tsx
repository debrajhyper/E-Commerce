import Link from "next/link";

/**
 * Footer component
 *
 * This component renders the footer of the website.
 * It includes the copyright information and links to the terms of service and privacy policy.
 */
export default function Footer() {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-4 w-full shrink-0 items-center px-4 md:px-6 border-t">
            {/* Copyright information */}
            <p className="text-xs text-muted-foreground">&copy; 2024 E-commerce Store. All rights reserved.</p>

            {/* Links to terms of service and privacy policy */}
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    {/* Terms of Service link */}
                    Terms of Service
                </Link>
                <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
                    {/* Privacy Policy link */}
                    Privacy Policy
                </Link>
            </nav>
        </footer>
    )
}