"use client";
import { useEffect, useState } from "react";

import { RouteType } from "../../types/routeType";
import FormComponent from "@/src/components/MyRoute/Form/FormComponent";
import { Button } from "@mui/material";
import RouteList from "@/src/components/MyRoute/RouteList/RouteList";

const MyRoutesPage = () => {
    const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [routes, setRoutes] = useState<RouteType[]>([]);
    useEffect(() => {
        const fetchRoutes = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes`,
            );
            const data: RouteType[] = await res.json();
            setRoutes(data);
        };
        fetchRoutes();
    }, []);

    return (
        <main className="flex flex-col  w-full min-h-[80vh]  gap-6">
            <div className="w-full rounded-xl overflow-hidden shadow-md">
                {selectedRoute || isCreating ? (
                    <FormComponent
                        selectedRoute={
                            selectedRoute ?? {
                                id: crypto.randomUUID(),
                                name: "",
                                description: "",
                                type: "Run",
                                distance: 0,
                                date: new Date().toISOString(),
                                features: [],
                                color: "#f97316",
                            }
                        }
                        onRouteAdded={(newRoute) => {
                            setRoutes((prev) => {
                                const exists = prev.some(
                                    (r) => r.id === newRoute.id,
                                );
                                return exists
                                    ? prev.map((r) =>
                                          r.id === newRoute.id ? newRoute : r,
                                      )
                                    : [newRoute, ...prev];
                            });

                            setSelectedRoute(newRoute);
                            setIsCreating(false);
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-[500px] border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500">
                        Selecteer een route of klik op "Add route"
                    </div>
                )}
            </div>
            <div className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">My routes</h2>
                    <div className="flex gap-2">
                        <Button
                            className="w-full mt-4 bg-orange-500 hover:bg-amber-500 cursor-pointer"
                            onClick={() => {
                                setSelectedRoute(null);
                                setIsCreating(true);
                            }}
                        >
                            Add route
                        </Button>
                    </div>
                </div>

                <RouteList
                    routes={routes}
                    setRoutes={setRoutes}
                    onSelectRoute={(route) => {
                        setSelectedRoute(route);
                        setIsCreating(false);
                    }}
                    selectedRoute={selectedRoute}
                />
            </div>
        </main>
    );
};
export default MyRoutesPage;
