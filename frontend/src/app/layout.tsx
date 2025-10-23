import NavBar from "@/components/NavBar";
import "./globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-gray-100">
                <div className="mx-auto max-w-7xl px-6">
                    <NavBar />
                </div>

                <main className="mx-auto max-w-7xl px-6">{children}</main>
            </body>
        </html>
    );
}
