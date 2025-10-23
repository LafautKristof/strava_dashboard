"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import polyline from "@mapbox/polyline";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { SegmentEffort } from "@/app/types/activities";
import "leaflet/dist/leaflet.css";
import { Streams } from "@/app/types/streams";
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

function FitBoundsHelper({
    fullCoords,
    segmentCoords,
}: {
    fullCoords: [number, number][];
    segmentCoords?: [number, number][];
}) {
    const map = useMap();
    const bounds = useMemo(() => {
        const coordsToUse = segmentCoords?.length ? segmentCoords : fullCoords;
        return L.latLngBounds(coordsToUse);
    }, [segmentCoords, fullCoords]);

    useEffect(() => {
        if (!map || !bounds) return;
        setTimeout(() => {
            map.fitBounds(bounds, { padding: [40, 40] });
        }, 150);
    }, [map, bounds]);

    return null;
}

export default function ActivityMap({
    activityPolyline,
    hoveredSegment,
    hoverKm,
    streams,
    type,
}: {
    activityPolyline: string;
    hoveredSegment?: SegmentEffort | null;
    hoverKm?: number | null;
    streams: Streams;
    type: string;
}) {
    const [LRef, setLRef] = useState<typeof import("leaflet") | null>(null);

    useEffect(() => {
        import("leaflet").then((mod) => setLRef(mod));
    }, []);

    const coords: [number, number][] = useMemo(() => {
        if (!activityPolyline) return [];
        return polyline
            .decode(activityPolyline)
            .map(([lat, lng]): [number, number] => [lat, lng]);
    }, [activityPolyline]);

    const segmentCoords = useMemo(() => {
        if (!hoveredSegment || !coords.length) return undefined;
        const start = hoveredSegment.segment.start_latlng;
        const end = hoveredSegment.segment.end_latlng;
        if (!start || !end || start.length !== 2 || end.length !== 2)
            return undefined;

        const findClosestIndex = (target: [number, number]) => {
            let minDist = Infinity;
            let index = 0;
            for (let i = 0; i < coords.length; i++) {
                const [lat, lng] = coords[i];
                const d = Math.hypot(lat - target[0], lng - target[1]);
                if (d < minDist) {
                    minDist = d;
                    index = i;
                }
            }
            return index;
        };

        const startIdx = findClosestIndex(start as [number, number]);
        const endIdx = findClosestIndex(end as [number, number]);
        return coords.slice(
            Math.min(startIdx, endIdx),
            Math.max(startIdx, endIdx)
        );
    }, [hoveredSegment, coords]);

    const hoverCoord = useMemo(() => {
        if (
            hoverKm == null ||
            !streams?.distance?.data?.length ||
            !coords.length
        )
            return null;

        const totalDistance =
            streams.distance.data[streams.distance.data.length - 1];
        const ratio = (hoverKm * 1000) / totalDistance;
        const index = Math.min(
            coords.length - 1,
            Math.floor(ratio * coords.length)
        );

        return coords[index] ?? null;
    }, [hoverKm, streams, coords]);

    if (!coords.length) {
        return (
            <p className="p-4 text-center text-gray-500">No polyline data</p>
        );
    }

    return (
        <div className="relative h-[300px] w-full border rounded-md overflow-hidden">
            <MapContainer
                key={`activity-map-${activityPolyline}`}
                center={coords[0] ?? [50.85, 4.35]}
                zoom={13}
                scrollWheelZoom={false}
                className="absolute inset-0 w-full h-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                />

                <Polyline
                    positions={coords}
                    pathOptions={{ color: "#3b82f6", weight: 4 }}
                />

                {segmentCoords && (
                    <Polyline
                        positions={segmentCoords}
                        pathOptions={{ color: "red", weight: 6, opacity: 0.9 }}
                    />
                )}

                <FitBoundsHelper
                    fullCoords={coords}
                    segmentCoords={segmentCoords}
                />
                {hoverCoord && (
                    <Marker
                        key={hoverCoord.join(",")}
                        position={hoverCoord}
                        icon={getTypeMarker(type)}
                    />
                )}
                {coords.length > 0 && (
                    <>
                        <Marker position={coords[0]} icon={startIcon} />
                        <Marker
                            position={coords[coords.length - 1]}
                            icon={finishIcon}
                        />
                    </>
                )}
            </MapContainer>
        </div>
    );
}
