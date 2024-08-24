import Link from 'next/link';
import { LOGIN_LINK, SIGNUP_LINK } from '@/constants';

/**
 * Homepage component
 *
 * This component renders the homepage of the website.
 * It includes a heading, a paragraph and two links (Login and Sign Up).
 */
export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">
        {/* Welcome heading */}
        Welcome to Our E-commerce Store
      </h1>
      <p className="text-xl mb-8">
        {/* Introductory paragraph */}
        Find great products at amazing prices!
      </p>
      <div className="space-x-4">
        {/* Login link */}
        <Link href={LOGIN_LINK} className="btn btn-primary">
          Login
        </Link>
        {/* Sign Up link */}
        <Link href={SIGNUP_LINK} className="btn btn-secondary">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
