"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { useMap } from "react-leaflet";
import { Activities } from "@/app/types/activities";
import "leaflet/dist/leaflet.css";
import { finishIcon } from "@/helpers/Map/finishIcon";
import { startIcon } from "@/helpers/Map/startIcon";
import { getTypeMarker } from "@/helpers/Map/getTypeMarker";

const MapContainer = dynamic(
    () => import("react-leaflet").then((m) => m.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((m) => m.TileLayer),
    { ssr: false }
);
const Polyline = dynamic(
    () => import("react-leaflet").then((m) => m.Polyline),
    { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
    ssr: false,
});

function MapResizeFix() {
    const map = useMap();
    useEffect(() => {
        if (!map) return;
        const resize = () => map.invalidateSize();
        resize();
        const t1 = setTimeout(resize, 300);
        const t2 = setTimeout(resize, 800);
        window.addEventListener("resize", resize);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            window.removeEventListener("resize", resize);
        };
    }, [map]);
    return null;
}

function FitBoundsHelper({
    fullCoords,
    segmentCoords,
}: {
    fullCoords: [number, number][];
    segmentCoords?: [number, number][];
}) {
    const map = useMap();
    const segmentKey = JSON.stringify(segmentCoords);
    const fullKey = JSON.stringify(fullCoords);
    useEffect(() => {
        if (!map) return;
        import("leaflet").then((L) => {
            const bounds = L.latLngBounds(segmentCoords ?? fullCoords);
            setTimeout(() => map.fitBounds(bounds, { padding: [40, 40] }), 200);
        });
    }, [map, fullCoords, segmentCoords, segmentKey, fullKey]);
    return null;
}

export default function SplitsMap({
    activity,
    selectedSplit,
    hoverKm,
}: {
    activity: Activities;
    selectedSplit: number | null;
    hoverKm?: number | null;
}) {
    const [LRef, setLRef] = useState<typeof import("leaflet") | null>(null);

    useEffect(() => {
        import("leaflet").then((mod) => setLRef(mod));
    }, []);

    const coords: [number, number][] = useMemo(() => {
        if (!activity.map?.summary_polyline) return [];
        return polyline
            .decode(activity.map.summary_polyline)
            .map(([lat, lng]: [number, number]) => [lat, lng]);
    }, [activity.map?.summary_polyline]);

    const center: [number, number] = coords[0] ?? [50.85, 4.35];

    const segmentCoords = useMemo(() => {
        if (selectedSplit === null || !coords.length || !activity.distance)
            return undefined;

        const totalDistance = activity.distance / 1000;
        const startKm = selectedSplit;
        const endKm =
            selectedSplit === Math.floor(totalDistance)
                ? totalDistance
                : selectedSplit + 1;

        const startIndex = Math.floor(
            (startKm / totalDistance) * coords.length
        );
        const endIndex = Math.floor((endKm / totalDistance) * coords.length);

        const sliced = coords.slice(startIndex, endIndex);

        return sliced;
    }, [selectedSplit, coords, activity.distance]);

    const hoverCoord = useMemo(() => {
        if (hoverKm == null || !coords.length || !activity.distance)
            return null;
        const totalKm = activity.distance / 1000;
        const ratio = hoverKm / totalKm;
        const index = Math.min(
            coords.length - 1,
            Math.floor(ratio * coords.length)
        );
        return coords[index] ?? null;
    }, [hoverKm, coords, activity.distance]);

    if (!LRef) {
        return (
            <div className="h-[400px] w-full flex items-center justify-center border rounded-md text-muted-foreground">
                Kaart wordt geladen...
            </div>
        );
    }

    return (
        <div className="relative h-[400px] w-full border rounded-md overflow-hidden">
            <MapContainer
                key={activity.id}
                center={center}
                zoom={13}
                scrollWheelZoom={false}
                className="absolute inset-0 w-full h-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                />

                <Polyline
                    positions={coords}
                    pathOptions={{ color: "blue", weight: 4 }}
                />
                {coords.length > 0 && (
                    <>
                        <Marker position={coords[0]} icon={startIcon} />
                        <Marker
                            position={coords[coords.length - 1]}
                            icon={finishIcon}
                        />
                    </>
                )}

                {segmentCoords && (
                    <Polyline
                        positions={segmentCoords}
                        pathOptions={{ color: "red", weight: 5 }}
                    />
                )}

                {hoverCoord && LRef && (
                    <Marker
                        key={hoverCoord.join(",")}
                        position={hoverCoord}
                        icon={getTypeMarker(activity.type)}
                    />
                )}

                <FitBoundsHelper
                    fullCoords={coords}
                    segmentCoords={segmentCoords}
                />
                <MapResizeFix />
            </MapContainer>
        </div>
    );
}
