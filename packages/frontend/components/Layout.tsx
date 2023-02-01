import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header className="bg-neutral-500 py-4">
      <div className="container mx-auto px-4">
        <nav className="flex justify-center">
          <Link href="/" className="text-gray-100 hover:text-blue-700 mx-4">
            Home
          </Link>
          <Link href="/about" className="text-gray-100 hover:text-blue-700 mx-4">
            About
          </Link>
          {/* <Link href="/users" className="text-gray-100hover:text-blue-700 mx-4">
                        Users List
                    </Link> */}
          <Link href="/unirep" className="text-gray-100 hover:text-blue-700 mx-4">
            Unirep
          </Link>
          <Link href="/reputation" className="text-gray-100 hover:text-blue-700 mx-4">
            Reputation
          </Link>
          {/* <a href="/api/users" className="text-gray-100 hover:text-blue-700 mx-4">
                        Users API
                    </a> */}
        </nav>
      </div>
    </header>
    {children}
    {/* <footer className="bg-gray-100 py-4">
            <div className="container mx-auto px-4">
                <span className="flex justify-center text-gray-700">{}</span>
            </div>
        </footer> */}
  </div>
);

export default Layout;
