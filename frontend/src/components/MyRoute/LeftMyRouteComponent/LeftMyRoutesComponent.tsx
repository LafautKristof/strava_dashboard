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
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function LeftMyRoutesComponent({
    routes,
    setRoutes,
    onSelectRoute,
}: {
    routes: RouteType[];
    setRoutes: Dispatch<SetStateAction<RouteType[]>>;
    onSelectRoute: (route: RouteType) => void;
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
                }
            );
            const data: RouteType[] = await res.json();
            setRoutes(data);
        } catch (err) {
            console.error("❌ Error fetching routes:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Weet je zeker dat je deze route wil verwijderen?"))
            return;
        setLoadingId(id);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes/${id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) throw new Error("Verwijderen mislukt");
            setRoutes((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("❌ Fout bij verwijderen:", err);
            alert("Verwijderen mislukt");
        } finally {
            setLoadingId(null);
        }
    };

    const deleteAllRoutes = async () => {
        if (!confirm("Weet je zeker dat je alle routes wil verwijderen?"))
            return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/my_routes`,
                {
                    method: "DELETE",
                }
            );
            if (!res.ok) throw new Error("Verwijderen mislukt");
            setRoutes([]); // Reset the routes state
        } catch (err) {
            console.error("❌ Fout bij verwijderen:", err);
            alert("Verwijderen mislukt");
        }
    };

    return (
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
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                            <TableCell>{route.type}</TableCell>
                            <TableCell>{route.name}</TableCell>
                            <TableCell>{route.date.split("T")[0]}</TableCell>
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
                                >
                                    <Trash2
                                        className={
                                            loadingId === route.id
                                                ? "animate-pulse text-gray-400"
                                                : ""
                                        }
                                    />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {routes.length === 0 && <p className="text-center">No routes</p>}
            {routes.length > 0 && (
                <Button onClick={deleteAllRoutes}>Delete all routes</Button>
            )}
        </ScrollArea>
    );
}
