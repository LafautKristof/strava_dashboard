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

export default function Map({ route }: { route?: string }) {
    if (!route) return null;
    const coords = decode(route).map(([lat, lng]) => [lat, lng]) as [
        number,
        number
    ][];

    return (
        <MapContainer
            key={`overview-map-${route}`}
            className="h-[400px] w-full rounded-lg"
            center={coords[0]}
            zoom={13}
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
            />
            <Polyline
                positions={coords}
                pathOptions={{ color: "gray", weight: 4 }}
            />
            <FitBounds coords={coords} />
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

function FitBounds({ coords }: { coords: [number, number][] }) {
    const map = useMap();
    useEffect(() => {
        if (coords?.length) {
            const bounds = L.latLngBounds(coords);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [coords, map]);
    return null;
}
