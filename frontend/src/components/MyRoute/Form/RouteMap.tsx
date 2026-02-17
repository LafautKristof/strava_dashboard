"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { Feature, LineString } from "geojson";
import EnableDrawing from "./EnableDrawing";
import "@geoman-io/leaflet-geoman-free";
import { RouteType } from "@/app/types/routeType";

interface Props {
    color: string;
    setDistance: (d: number) => void;
    setFeatures: (f: Feature<LineString>[]) => void;
    selectedRoute: RouteType | null;
}

export default function RouteMap({
    color,
    setDistance,
    setFeatures,
    selectedRoute,
}: Props) {
    const mapRef = useRef<L.Map | null>(null);
    function RenderSelectedRoute({
        selectedRoute,
    }: {
        selectedRoute: RouteType | null;
    }) {
        const map = useMap();

        useEffect(() => {
            if (!map || !selectedRoute) return;

            // oude layers verwijderen
            map.eachLayer((layer) => {
                // verwijder enkel jouw eigen GeoJSON layers
                if ((layer as any)._routeLayer) {
                    map.removeLayer(layer);
                }
            });

            const geoLayer = L.geoJSON(selectedRoute.features, {
                style: (feature) => ({
                    color: feature?.properties?.color ?? "#f97316",
                    weight: 3,
                }),
            }).addTo(map);
            geoLayer.eachLayer((layer) => {
                (layer as any)._routeLayer = true;
            });
            const bounds = geoLayer.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds);
            }
        }, [selectedRoute, map]);

        return null;
    }
    return (
        <div className="relative h-[500px] w-full">
            <MapContainer
                ref={mapRef}
                center={[51.05, 4.1]}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <EnableDrawing
                    mapRef={mapRef}
                    color={color}
                    setDistance={setDistance}
                    setFeatures={setFeatures}
                    selectedRoute={selectedRoute}
                />
                <RenderSelectedRoute selectedRoute={selectedRoute} />
            </MapContainer>
        </div>
    );
}
