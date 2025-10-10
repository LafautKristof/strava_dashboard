import Link from "next/link";
import ThemeChanger from "./ThemeChanger";

const NavBar = () => {
    return (
        <nav className="flex justify-between ">
            <div className="flex gap-3.5">
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/activities">Activities</Link>
            </div>
            <div>
                <ThemeChanger />
            </div>
        </nav>
    );
};
export default NavBar;
