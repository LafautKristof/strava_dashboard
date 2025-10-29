"use client";
import LeftMyRoutesComponent from "@/components/MyRoute/LeftMyRouteComponent/LeftMyRoutesComponent";
import { useEffect, useState } from "react";
import { RouteType } from "../types/routeType";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
const MiddleMyRouteComponent = dynamic(
    () =>
        import(
            "@/components/MyRoute/MiddleMyRouteComponent/MiddleMyRouteComponent"
        ),
    { ssr: false }
);
const MyRoutesPage = () => {
    const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
    const [routes, setRoutes] = useState<RouteType[]>([]);
    useEffect(() => {
        const fetchRoutes = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes`
            );
            const data: RouteType[] = await res.json();
            setRoutes(data);
        };
        fetchRoutes();
    }, []);

    return (
        <main className="flex flex-col lg:flex-row w-full min-h-[80vh] items-start gap-6">
            <div className="w-full lg:w-1/3">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">My routes</h2>
                    <div className="flex gap-2">
                        <Button
                            variant="default"
                            disabled={!!selectedRoute}
                            onClick={() =>
                                setSelectedRoute({
                                    id: crypto.randomUUID(),
                                    name: "",
                                    description: "",
                                    type: "Run",
                                    distance: 0,
                                    date: new Date().toISOString(),
                                    features: [],
                                    color: "#f97316",
                                })
                            }
                        >
                            Add route
                        </Button>
                        <Button
                            variant="outline"
                            disabled={!selectedRoute}
                            onClick={() => setSelectedRoute(null)}
                        >
                            ← Back
                        </Button>
                    </div>
                </div>

                <LeftMyRoutesComponent
                    routes={routes}
                    setRoutes={setRoutes}
                    onSelectRoute={(route) => setSelectedRoute(route)}
                />
            </div>

            <div className="w-full lg:w-2/3">
                <MiddleMyRouteComponent
                    onRouteAdded={(newRoute) => {
                        setRoutes((prev) => {
                            const exists = prev.some(
                                (r) => r.id === newRoute.id
                            );
                            return exists
                                ? prev.map((r) =>
                                      r.id === newRoute.id ? newRoute : r
                                  )
                                : [newRoute, ...prev];
                        });
                        setSelectedRoute(newRoute);
                    }}
                    selectedRoute={selectedRoute}
                />
            </div>
        </main>
    );
};
export default MyRoutesPage;
