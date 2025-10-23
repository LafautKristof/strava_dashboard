import Link from "next/link";

const NavBar = () => {
    return (
        <nav className="flex justify-between items-center bg-orange-300 px-4 py-3 sm:px-8 text-lg sm:text-xl md:text-2xl">
            <div className="flex gap-4 sm:gap-6">
                <Link href="/">Home</Link>
                <Link href="/dashboard">Dashboard</Link>
            </div>
        </nav>
    );
};
export default NavBar;
