"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Feature, LineString } from "geojson";
import { RouteType } from "@/src/types/routeType";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

interface Props {
    mapRef: React.RefObject<L.Map | null>;
    color: string;
    setDistance: (d: number) => void;
    setFeatures: (f: Feature<LineString>[]) => void;
    selectedRoute: RouteType | null;
}

export default function EnableDrawing({
    mapRef,
    color,
    setDistance,
    setFeatures,
    selectedRoute,
}: Props) {
    const map = useMap();
    const layersRef = useRef<L.Polyline[]>([]);
    const colorRef = useRef(color);

    useEffect(() => {
        colorRef.current = color;
    }, [color]);

    const calculateDistance = (layer: L.Polyline) => {
        const latlngs = layer.getLatLngs() as L.LatLng[];
        let total = 0;
        for (let i = 1; i < latlngs.length; i++) {
            total += latlngs[i - 1].distanceTo(latlngs[i]);
        }
        return total / 1000;
    };

    const updateTotal = () => {
        const total = layersRef.current.reduce(
            (acc, l) => acc + calculateDistance(l),
            0,
        );

        setDistance(total);

        const features = layersRef.current.map((l) => {
            const geo = l.toGeoJSON() as Feature<LineString>;
            geo.properties = {
                ...(geo.properties || {}),
                color: (l.options as any).color,
            };
            return geo;
        });

        setFeatures(features);
    };

    useEffect(() => {
        if (!map) return;

        // Eerst altijd alles opruimen
        layersRef.current.forEach((layer) => map.removeLayer(layer));
        layersRef.current = [];

        if (!selectedRoute) {
            // Nieuwe route → lege map
            setDistance(0);
            setFeatures([]);
            return;
        }

        // Bestaande route tekenen
        const geoLayer = L.geoJSON(selectedRoute.features ?? [], {
            style: (feature) => ({
                color: feature?.properties?.color ?? "#f97316",
                weight: 3,
            }),
        });

        geoLayer.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
                layer.addTo(map);
                layersRef.current.push(layer);

                layer.on("pm:editend", updateTotal);
                layer.on("pm:remove", () => {
                    layersRef.current = layersRef.current.filter(
                        (l) => l !== layer,
                    );
                    updateTotal();
                });
            }
        });

        updateTotal();
    }, [selectedRoute, map]);

    useEffect(() => {
        if (!map) return;

        const initGeoman = () => {
            if (!map.pm) {
                setTimeout(initGeoman, 50);
                return;
            }

            map.pm.addControls({
                position: "topleft",
                drawPolyline: true,
                editMode: true,
                removalMode: true,
                drawMarker: false,
                drawPolygon: false,
                drawRectangle: false,
                drawCircle: false,
                drawCircleMarker: false,
            });

            map.on("pm:create", (e: any) => {
                const layer = e.layer;
                layer.setStyle({ color: colorRef.current });

                layersRef.current.push(layer);
                updateTotal();

                layer.on("pm:editend", updateTotal);
                layer.on("pm:remove", () => {
                    layersRef.current = layersRef.current.filter(
                        (l) => l !== layer,
                    );
                    updateTotal();
                });
            });
        };

        initGeoman();

        return () => {
            map.off("pm:create");
        };
    }, [map]);

    return null;
}
