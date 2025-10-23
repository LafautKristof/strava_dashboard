import NavBar from "@/components/NavBar";
import "./globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-100 mx-0 sm:mx-2 md:mx-10 lg:mx-40 xl:mx-80">
                <NavBar />
                {children}
            </body>
        </html>
    );
}
