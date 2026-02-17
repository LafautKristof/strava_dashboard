import {
    MapContainer,
    TileLayer,
    Polyline,
    useMap,
    Marker,
} from "react-leaflet";
import { decode } from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { startIcon } from "@/src/helpers/MapHelpers/startIcon";
import { finishIcon } from "@/src/helpers/MapHelpers/finishIcon";

export default function Map({
    route,
    small = false,
    activitieType,
}: {
    route?: string;
    small?: boolean;
    activitieType?: string;
}) {
    if (!route) return null;
    const coords = decode(route).map(([lat, lng]) => [lat, lng]) as [
        number,
        number,
    ][];
    const heightClass = small ? "h-[50px]" : "h-[400px]";
    const color = {
        Run: "#ff6900",
        Walk: "#4caf50",
        Ride: "#3b82f6",
        Workout: "#ad46ff",
        WeightTraining: "#ad46ff",
        Other: "#9ca3af",
    }[activitieType || "Run"];
    return (
        <MapContainer
            key={`overview-map-${route}`}
            className={`${heightClass} w-full rounded-lg`}
            scrollWheelZoom={!small}
            dragging={!small}
            doubleClickZoom={!small}
            zoomControl={!small}
            attributionControl={!small}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Polyline
                positions={coords}
                pathOptions={{
                    color: color,
                    weight: small ? 3 : 5,
                }}
            />
            <FitBounds coords={coords} small={small} />
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
    );
}

function FitBounds({
    coords,
    small,
}: {
    coords: [number, number][];
    small?: boolean;
}) {
    const map = useMap();
    useEffect(() => {
        if (!coords?.length) return;
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, {
            paddingTopLeft: [50, 0],
            paddingBottomRight: [0, 90],
        });

        requestAnimationFrame(() => {
            map.invalidateSize();
        });
    }, [coords, map, small]);
    return null;
}
