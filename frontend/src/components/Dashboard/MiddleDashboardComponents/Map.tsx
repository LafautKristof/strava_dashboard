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
import { startIcon } from "@/helpers/Map/startIcon";
import { finishIcon } from "@/helpers/Map/finishIcon";

export default function Map({
    route,
    small = false,
}: {
    route?: string;
    small?: boolean;
}) {
    if (!route) return null;
    const coords = decode(route).map(([lat, lng]) => [lat, lng]) as [
        number,
        number
    ][];
    const heightClass = small ? "h-[100px]" : "h-[400px]";
    return (
        <MapContainer
            key={`overview-map-${route}`}
            className={`${heightClass} w-full rounded-lg`}
            center={coords[0]}
            zoom={13}
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
                    color: "gray",
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
        if (coords?.length) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: small ? [20, 20] : [30, 30] });
        }
        setTimeout(() => {
            map.invalidateSize();
        }, 200);
    }, [coords, map]);
    return null;
}
