import L from "leaflet";

import { markerIcons } from "@/helpers/DrawMap/markers";
import type { Feature, LineString } from "geojson";

let startMarker: L.Marker | null = null;
let finishMarker: L.Marker | null = null;

export function updateStartFinishMarkers(
    map: L.Map,
    features: Feature<LineString>[]
) {
    const allCoords = features
        .filter((f) => f.geometry.type === "LineString")
        .flatMap((f) => f.geometry.coordinates);

    if (allCoords.length < 2) {
        if (startMarker) map.removeLayer(startMarker);
        if (finishMarker) map.removeLayer(finishMarker);
        startMarker = null;
        finishMarker = null;
        return;
    }

    const start = allCoords[0];
    const finish = allCoords[allCoords.length - 1];

    if (startMarker) map.removeLayer(startMarker);
    if (finishMarker) map.removeLayer(finishMarker);

    startMarker = L.marker([start[1], start[0]], {
        icon: markerIcons.start,
    }).addTo(map);
    finishMarker = L.marker([finish[1], finish[0]], {
        icon: markerIcons.finish,
    }).addTo(map);
}

export function checkDisconnected(features: Feature[], map: L.Map) {
    if (features.length < 2) return;

    const prev = features[features.length - 2];
    const curr = features[features.length - 1];

    if (
        prev.geometry.type === "LineString" &&
        curr.geometry.type === "LineString"
    ) {
        const prevEnd = prev.geometry.coordinates.at(-1)!;
        const currStart = curr.geometry.coordinates[0];
        const dist = L.latLng(prevEnd[1], prevEnd[0]).distanceTo(
            L.latLng(currStart[1], currStart[0])
        );

        if (dist > 5) {
            const popup = L.popup()
                .setLatLng([currStart[1], currStart[0]])
                .setContent(
                    "⚠️ Deze lijn is niet verbonden met de vorige.<br/>💡 Zorg dat lijnen elkaar raken voor één route."
                )
                .openOn(map);
            setTimeout(() => map.closePopup(popup), 4000);
        }
    }
}
