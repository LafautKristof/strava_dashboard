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
    ];

    return (
        <nav className="bg-orange-300 px-4 py-3 sm:px-8 shadow-md">
            <div className="flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold">
                    🏃 Strava Dashboard
                </h1>

                {/* 📱 Mobielmenu knop */}
                <button
                    className="sm:hidden text-2xl"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* 💻 Desktop links */}
                <div className="hidden sm:flex gap-6 text-lg sm:text-xl">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`hover:underline ${
                                pathname === link.href
                                    ? "font-bold underline"
                                    : ""
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>

            {/* 📱 Mobielmenu */}
            {open && (
                <div className="flex flex-col gap-3 mt-3 sm:hidden text-lg">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`${
                                pathname === link.href
                                    ? "font-semibold underline"
                                    : ""
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default NavBar;
