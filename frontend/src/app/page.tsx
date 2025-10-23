"use client";

import Image from "next/image";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200 p-6 text-gray-800">
            <div className="max-w-3xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-md p-8 space-y-6  ">
                <h1 className="text-2xl font-bold text-center text-blue-600">
                    Strava Portfolio Project Disclaimer
                </h1>

                <p>
                    This project was created solely for{" "}
                    <strong>educational</strong> and <strong>portfolio</strong>{" "}
                    purposes. It is a personal demonstration of my technical
                    skills in <strong>data visualization</strong>,{" "}
                    <strong>API integration</strong>, and{" "}
                    <strong>interactive UI design</strong>.
                </p>

                <p>
                    The data displayed in this application is{" "}
                    <strong>personal, non-commercial Strava data</strong>{" "}
                    obtained through the official <strong>Strava API</strong>{" "}
                    using my own athlete access token. All activity information,
                    routes, metrics, and statistics are the{" "}
                    <strong>
                        exclusive property of Strava and their respective data
                        owners
                    </strong>
                    .
                </p>

                <p>
                    This project is{" "}
                    <strong>
                        not affiliated with, endorsed by, or sponsored by Strava
                    </strong>{" "}
                    in any way. The content shown here is used only to
                    illustrate technical functionality — it must{" "}
                    <strong>not be copied, redistributed, or used</strong> for
                    personal or commercial purposes without explicit permission
                    from Strava or the data owner.
                </p>

                <p>
                    Technologies used include <strong>Next.js</strong>,{" "}
                    <strong>React</strong>, <strong>TypeScript</strong>,{" "}
                    <strong>Leaflet</strong>, <strong>Recharts</strong>, and the{" "}
                    <strong>Strava API</strong>. The application demonstrates{" "}
                    <strong>real-time charting</strong>,{" "}
                    <strong>dynamic maps</strong>, and{" "}
                    <strong>interactive analytics</strong> built with modern
                    front-end frameworks.
                </p>

                <div className="flex justify-center mt-4">
                    <Image
                        src="/strava_logo_icon_147232.png"
                        alt="Strava Logo"
                        width={120}
                        height={40}
                    />
                </div>
            </div>
        </main>
    );
}
