"use client";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { Feature, LineString } from "geojson";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { updateStartFinishMarkers } from "@/helpers/DrawMap/updateStartFinishMarkers";
import { RouteType } from "@/app/types/routeType";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";

interface PMCreateEvent extends L.LeafletEvent {
    layer: L.Polyline;
    shape: string;
}
interface ColoredPolyline extends L.Polyline {
    options: L.PolylineOptions & { color: string };
}
function updateTotalForMap(
    map: L.Map,
    setDistance?: (val: number) => void,
    setDrawnFeatures?: (features: Feature<LineString>[]) => void
) {
    const allPolylines: L.Polyline[] = [];
    map.eachLayer((layer) => {
        if (layer instanceof L.Polyline) allPolylines.push(layer);
    });

    const totalKm =
        allPolylines.reduce((acc, l) => {
            const latlngs = l.getLatLngs() as L.LatLng[];
            for (let i = 1; i < latlngs.length; i++) {
                acc += latlngs[i - 1].distanceTo(latlngs[i]);
            }
            return acc;
        }, 0) / 1000;

    const allFeatures = allPolylines.map((l) => {
        const geojson = l.toGeoJSON() as Feature<LineString>;
        geojson.properties = { color: (l as ColoredPolyline).options.color };

        return geojson;
    });

    if (setDistance) setDistance(totalKm);
    if (setDrawnFeatures) setDrawnFeatures(allFeatures);

    updateStartFinishMarkers(map, allFeatures);
}

export default function MiddleMyRouteComponent({
    onRouteAdded,
    selectedRoute,
}: {
    onRouteAdded: (route: RouteType) => void;
    selectedRoute: RouteType | null;
}) {
    const mapRef = useRef<L.Map | null>(null);
    const existingLayersRef = useRef<L.Polyline[]>([]);

    const [drawnFeatures, setDrawnFeatures] = useState<Feature<LineString>[]>(
        []
    );
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("Run");
    const [distance, setDistance] = useState(0);
    const [color, setColor] = useState("#f97316");

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !selectedRoute) return;
        setName(selectedRoute.name || "");
        setDescription(selectedRoute.description || "");
        setType(selectedRoute.type || "Run");
        setDistance(selectedRoute.distance || 0);

        map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        const geoLayer = L.geoJSON(selectedRoute.features, {
            style: (feature) => ({
                color: feature?.properties?.color ?? "#f97316",
                weight: 3,
            }),
        }).addTo(map);

        updateStartFinishMarkers(map, selectedRoute.features);

        const bounds = geoLayer.getBounds();
        if (bounds.isValid()) {
            map.fitBounds(bounds);
        } else {
            map.setView([51.05, 4.1], 13);
        }
        setDrawnFeatures(selectedRoute.features);

        import("leaflet").then((Lmod) => {
            const layers: L.Polyline[] = [];
            geoLayer.eachLayer((l) => {
                if (l instanceof Lmod.Polyline) {
                    l.on("pm:editend", () =>
                        updateTotalForMap(map, setDistance)
                    );
                    l.on("pm:remove", () =>
                        updateTotalForMap(map, setDistance)
                    );
                    layers.push(l);
                }
            });

            existingLayersRef.current = layers;
        });
    }, [selectedRoute]);
    const handleSave = async () => {
        if (drawnFeatures.length === 0) {
            alert("Teken eerst een route!");
            return;
        }
        const payload = {
            id: selectedRoute?.id || crypto.randomUUID(),
            name,
            description,
            type,
            distance,
            features: drawnFeatures,
            date: selectedRoute?.date || new Date().toISOString(),
        };

        const isUpdate = !!selectedRoute;
        const url = isUpdate
            ? `${process.env.NEXT_PUBLIC_API_URL}/update_route/${payload.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/save_route`;
        const res = await fetch(`${url}`, {
            method: isUpdate ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        onRouteAdded(data);
        const map = mapRef.current;
        if (!isUpdate && map) {
            map.eachLayer((layer) => {
                if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        }

        setDrawnFeatures([]);
        setDistance(0);
        setName("");
        setDescription("");

        alert(isUpdate ? "Route changed" : "Route saved");
    };
    return (
        <>
            <div className="relative h-[500px] w-full">
                <MapContainer
                    ref={mapRef}
                    center={[51.05, 4.1]}
                    zoom={13}
                    className="h-full w-full"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <EnableDrawing
                        setDrawnFeatures={setDrawnFeatures}
                        setDistance={setDistance}
                        color={color}
                        existingLayersRef={existingLayersRef}
                    />
                </MapContainer>
                <p className="absolute top-3 right-3 z-[999] bg-white/80 backdrop-blur-sm text-sm font-semibold px-3 py-1 rounded shadow">
                    📏 {distance.toFixed(2)} km
                </p>
            </div>

            <div className="flex gap-4 my-4">
                <Input
                    type="text"
                    placeholder="Naam van de route"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
                <Select value={type} onValueChange={(value) => setType(value)}>
                    <SelectContent>
                        <SelectItem value="Run">Run</SelectItem>
                        <SelectItem value="Ride">Ride</SelectItem>
                        <SelectItem value="Walk">Walk</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <Input
                        type="color"
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-20 h-12 border rounded"
                    />
                </div>
            </div>
            <Textarea
                placeholder="Beschrijving (optioneel)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
            />

            <Button
                onClick={handleSave}
                disabled={!name.trim() || drawnFeatures.length === 0}
                className={`px-4 py-2 rounded text-white font-semibold transition
        ${
            !name.trim() || drawnFeatures.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
        }`}
            >
                Opslaan
            </Button>
        </>
    );
}

function EnableDrawing({
    setDrawnFeatures,
    setDistance,
    color,
    existingLayersRef,
}: {
    setDrawnFeatures: (features: Feature<LineString>[]) => void;
    setDistance: (distance: number) => void;
    color: string;
    existingLayersRef: React.RefObject<L.Polyline[]>;
}) {
    const map = useMap();
    const drawnLayers = existingLayersRef;
    const colorRef = useRef(color);

    const calculateDistance = (layer: L.Polyline) => {
        const latlngs = layer.getLatLngs() as L.LatLng[];
        let total = 0;
        for (let i = 1; i < latlngs.length; i++) {
            total += latlngs[i - 1].distanceTo(latlngs[i]);
        }
        return total / 1000;
    };

    const updateTotal = () => {
        const totalKm = drawnLayers.current.reduce(
            (acc, l) => acc + calculateDistance(l),
            0
        );
        setDistance(totalKm);
        if (drawnLayers.current.length > 1) {
            const sorted: L.Polyline[] = [drawnLayers.current[0]];
            const remaining = drawnLayers.current.slice(1);

            while (remaining.length > 0) {
                const last = sorted[sorted.length - 1];
                const lastEnd = (last.getLatLngs() as L.LatLng[]).at(-1)!;

                let closestIdx = 0;
                let closestDist = Infinity;

                remaining.forEach((layer, i) => {
                    const start = (layer.getLatLngs() as L.LatLng[])[0];
                    const end = (layer.getLatLngs() as L.LatLng[]).at(-1)!;
                    const dist = Math.min(
                        lastEnd.distanceTo(start),
                        lastEnd.distanceTo(end)
                    );
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIdx = i;
                    }
                });

                sorted.push(remaining.splice(closestIdx, 1)[0]);
            }

            drawnLayers.current = sorted;
        }
        const orderedCoords = drawnLayers.current.flatMap((l) => {
            const latlngs = l.getLatLngs() as L.LatLng[];
            return latlngs.map((p) => [p.lng, p.lat]);
        });

        const combinedFeature: Feature<LineString> = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: orderedCoords,
            },
            properties: { color: "#f97316" },
        };

        const allFeatures = [
            ...drawnLayers.current.map((l) => l.toGeoJSON()),
            combinedFeature,
        ];

        updateStartFinishMarkers(map, [combinedFeature]);

        setDrawnFeatures(allFeatures as Feature<LineString>[]);
    };
    useEffect(() => {
        colorRef.current = color;
    }, [color]);
    useEffect(() => {
        if (!map) return;

        map.pm.addControls({
            position: "topleft",
            drawMarker: false,
            drawPolygon: false,
            drawRectangle: false,
            drawCircle: false,
            drawCircleMarker: false,
            drawPolyline: true,
            editMode: true,
            removalMode: true,
        });

        map.on("pm:create", (event: L.LeafletEvent) => {
            const e = event as PMCreateEvent;
            const layer = e.layer;
            const newCoords = layer.getLatLngs() as L.LatLng[];
            const currentColor = colorRef.current;
            layer.setStyle({ color: currentColor, weight: 3 });

            if (drawnLayers.current.length > 0) {
                const allCoords = drawnLayers.current.flatMap(
                    (l) => l.getLatLngs() as L.LatLng[]
                );

                const routeStart = allCoords[0];
                const routeEnd = allCoords[allCoords.length - 1];
                const startNew = newCoords[0];
                const endNew = newCoords[newCoords.length - 1];

                const distToStartStart = startNew.distanceTo(routeStart);
                const distToStartEnd = endNew.distanceTo(routeStart);
                const distToEndStart = startNew.distanceTo(routeEnd);
                const distToEndEnd = endNew.distanceTo(routeEnd);

                if (
                    Math.min(distToStartStart, distToStartEnd) <
                    Math.min(distToEndStart, distToEndEnd)
                ) {
                    if (distToStartStart < distToStartEnd) {
                        newCoords.reverse();
                    }
                    newCoords.push(routeStart);
                    layer.setLatLngs(newCoords);
                    drawnLayers.current.unshift(layer);
                } else {
                    if (distToEndEnd < distToEndStart) {
                        newCoords.reverse();
                    }
                    newCoords.unshift(routeEnd);
                    layer.setLatLngs(newCoords);
                    drawnLayers.current.push(layer);
                }
            } else {
                drawnLayers.current.push(layer);
            }

            updateTotal();

            layer.on("pm:editend", updateTotal);
            layer.on("pm:remove", () => {
                drawnLayers.current = drawnLayers.current.filter(
                    (l) => l !== layer
                );
                updateTotal();
            });
        });
        map.on("pm:globaleditmodetoggled", () => {
            if (!map.pm.globalEditModeEnabled()) {
                updateTotal();
            }
        });
        return () => {
            map.off("pm:create");
        };
    }, [map, setDrawnFeatures, setDistance]);

    return null;
}
