import NavBar from "@/components/NavBar";
import { ThemeProvider } from "next-themes";
import "./globals.css";
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <NavBar />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
