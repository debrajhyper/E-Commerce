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
    <div className="relative text-center">
      <section className="w-full py-12 sm:py-24 lg:py-32">
        <div className="container px-4 md:px-6 grid items-center justify-center gap-4 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Elevate Your Style Today</h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Browse our curated collection and find the perfect pieces to complement your wardrobe.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-8 mt-8">
            <Link
              href={LOGIN_LINK}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Shop the Collection
            </Link>
          </div>
        </div>
      </section>
      <div className="space-x-4">
      </div>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]">
        </div>
      </div>
    </div>
  );
}
