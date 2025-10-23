import { Marker, Polyline, useMap } from "react-leaflet";

export function HighlightSegment({
    coords,
    segmentLength,
    splitIndex,
}: {
    coords: [number, number][];
    segmentLength: number;
    splitIndex: number;
}) {
    const start = splitIndex * segmentLength;
    const end = start + segmentLength;
    const segment = coords.slice(start, end);
    const map = useMap();

    if (segment.length > 0)
        map.flyTo(segment[Math.floor(segment.length / 2)], 14, {
            duration: 0.5,
        });

    return (
        <>
            <Polyline positions={segment} color="red" weight={5} />
            <Marker position={segment[0]} />
        </>
    );
}
