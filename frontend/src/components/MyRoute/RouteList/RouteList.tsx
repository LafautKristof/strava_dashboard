"use client";

import { RouteType } from "@/app/types/routeType";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import formatDateAndTime from "@/helpers/formatDateAndTime";
import { getTypeIcon } from "@/helpers/getTypeIcon";
import { Trash2 } from "lucide-react";

import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function RouteList({
    routes,
    setRoutes,
    onSelectRoute,
    selectedRoute,
}: {
    routes: RouteType[];
    setRoutes: Dispatch<SetStateAction<RouteType[]>>;
    onSelectRoute: (route: RouteType) => void;
    selectedRoute: RouteType | null;
}) {
    const [loadingId, setLoadingId] = useState<string | null>(null);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes`,
                {
                    cache: "no-cache",
                },
            );
            const data: RouteType[] = await res.json();
            setRoutes(data);
        } catch (err) {
            console.error("❌ Error fetching routes:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this route?")) return;
        setLoadingId(id);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes/${id}`,
                {
                    method: "DELETE",
                },
            );

            if (!res.ok) throw new Error("Verwijderen mislukt");
            setRoutes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Error deleting route:", err);
            alert("Deleting failed");
        } finally {
            setLoadingId(null);
        }
    };

    const deleteAllRoutes = async () => {
        if (!confirm("Are you sure you want to delete all routes?")) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes`,
                {
                    method: "DELETE",
                },
            );
            if (!res.ok) throw new Error("Deleting failed");
            setRoutes([]);
        } catch (err) {
            console.error("Error deleting route:", err);
            alert("Deleting failed");
        }
    };

    return (
        <>
            <ScrollArea className="max-h-[400px] w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Distance</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {routes.map((route) => (
                            <TableRow
                                key={route.id}
                                onClick={() => onSelectRoute(route)}
                                className={`
        cursor-pointer transition-all
        ${
            selectedRoute?.id === route.id
                ? "bg-orange-50 dark:bg-orange-900/30"
                : "hover:bg-orange-200"
        }
    `}
                            >
                                <TableCell
                                    className={
                                        selectedRoute?.id === route.id
                                            ? "border-l-4 border-orange-500"
                                            : ""
                                    }
                                >
                                    {getTypeIcon(route.type, "large")}
                                </TableCell>

                                <TableCell>{route.name}</TableCell>
                                <TableCell>
                                    {formatDateAndTime(
                                        route.date?.split("T")[0],
                                        1,
                                    ) ?? "-"}
                                </TableCell>
                                <TableCell>
                                    {route.distance.toFixed(2)} km
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(route.id);
                                        }}
                                        disabled={loadingId === route.id}
                                        className="cursor-pointer hover:bg-orange-200"
                                    >
                                        <Trash2
                                            className={`
                                                ${
                                                    loadingId === route.id
                                                        ? "animate-pulse text-gray-400"
                                                        : ""
                                                }
                                            `}
                                        />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {routes.length === 0 && (
                    <p className="text-center">No routes</p>
                )}
            </ScrollArea>
            <div className="h-2 flex justify-center mb-8">
                {routes.length > 0 && (
                    <Button
                        onClick={deleteAllRoutes}
                        variant={"destructive"}
                        className="cursor-pointer hover:bg-red-800"
                    >
                        Delete all routes
                    </Button>
                )}
            </div>
        </>
    );
}
