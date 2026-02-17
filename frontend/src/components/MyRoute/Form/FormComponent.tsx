"use client";

import { useEffect, useState } from "react";
import { Feature, LineString } from "geojson";
import RouteForm from "./RouteForm";
import { RouteType } from "@/types/routeType";
import dynamic from "next/dynamic";

const RouteMap = dynamic(() => import("./RouteMap"), {
    ssr: false,
});
export default function FormComponent({
    onRouteAdded,
    selectedRoute,
}: {
    onRouteAdded: (route: RouteType) => void;
    selectedRoute: RouteType | null;
}) {
    const [features, setFeatures] = useState<Feature<LineString>[]>([]);
    const [distance, setDistance] = useState(0);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#f97316");
    const [type, setType] = useState<"Run" | "Ride" | "Walk">("Run");
    useEffect(() => {
        if (!selectedRoute) return;

        setName(selectedRoute.name ?? "");
        setDescription(selectedRoute.description ?? "");
        setColor(selectedRoute.color ?? "#f97316");
        setFeatures(selectedRoute.features ?? []);
        setDistance(selectedRoute.distance ?? 0);
    }, [selectedRoute]);
    const handleSave = async () => {
        const payload = {
            id: selectedRoute?.id || crypto.randomUUID(),
            name,
            description,
            features,
            distance,
            color,
            date: selectedRoute?.date || new Date().toISOString(),
            type,
        };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/save_route`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            },
        );

        const data = await res.json();
        onRouteAdded(data);
    };

    return (
        <>
            <RouteMap
                color={color}
                setDistance={setDistance}
                setFeatures={setFeatures}
                selectedRoute={selectedRoute}
            />

            <RouteForm
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                color={color}
                type={type}
                setType={setType}
                setColor={setColor}
                onSave={handleSave}
                disabled={!name || features.length === 0}
            />
        </>
    );
}
