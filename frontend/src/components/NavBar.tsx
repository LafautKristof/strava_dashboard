"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const links = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
        { href: "/myroutes", label: "My routes" },
        { href: "/mystats", label: "My stats" },
        { href: "/mygear", label: "My gear" },
    ];

    return (
        <nav className="bg-orange-400 text-black px-4 py-3 sm:px-8 shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                    Strava Dashboard
                </h1>

                <button
                    className="sm:hidden text-3xl focus:outline-none transition-transform"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>

                <div className="hidden sm:flex gap-6 text-base md:text-lg font-medium">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`hover:underline transition-colors ${
                                pathname === link.href
                                    ? "font-bold underline"
                                    : "opacity-90 hover:opacity-100"
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div
                className={`sm:hidden overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
                }`}
            >
                <ul className="flex flex-col gap-3 bg-orange-300 rounded-lg p-4 shadow-inner">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`block w-full text-base font-medium py-2 rounded-md hover:bg-orange-200 transition ${
                                    pathname === link.href
                                        ? "bg-orange-200 font-semibold"
                                        : ""
                                }`}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
