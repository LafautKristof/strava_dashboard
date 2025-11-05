import NavBar from "@/components/NavBar";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kristof's Strava Dashboard",
    description: "Strava Dashboard for portfolio purposes",
    icons: {
        icon: "/myfavicon.png",
        shortcut: "/myfavicon.png",
        apple: "/myfavicon.png",
    },
    openGraph: {
        title: "Kristof's Strava Dashboard",
        description: "Strava Dashboard for portfolio purposes",
        url: "https://strava-dashboard-three-amber.vercel.app/",
        siteName: "Strava Dashboard",
        images: [{ url: "/port_strava.png" }],
    },
};
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
                    <main>{children}</main>{" "}
                </div>
            </body>
        </html>
    );
}
