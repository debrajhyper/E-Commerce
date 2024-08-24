import Link from 'next/link';
import '@/style/notfound.css';
import { HOME_LINK } from '@/constants';

export default function notFound() {
    return (
        <section className="page_404">
            {/* 404 page container */}
            <div className="container">
                {/* 404 page row */}
                <div className="row">
                    {/* 404 page content */}
                    <div className="col-sm-12 ">
                        {/* 404 page content inner */}
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            {/* 404 background */}
                            <div className="four_zero_four_bg">
                                {/* 404 title */}
                                <h1 className="text-center ">404</h1>
                            </div>
                            {/* 404 content box */}
                            <div className="contant_box_404">
                                {/* 404 title */}
                                <h3 className="h2">
                                    {/* 404 title inner */}
                                    Look like you&apos;re lost
                                </h3>
                                {/* 404 message */}
                                <p>
                                    {/* 404 message inner */}
                                    the page you are looking for not avaible!
                                </p>
                                {/* 404 home link */}
                                <Link href={HOME_LINK} className="link_404">Go to Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}