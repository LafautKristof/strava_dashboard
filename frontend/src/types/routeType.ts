import type { Feature, LineString, GeoJsonProperties } from "geojson";

export interface RouteFeatureProperties
    extends Omit<GeoJsonProperties, "color"> {
    color: string;
}

export interface RouteType {
    id: string;
    name: string;
    description: string;
    color: string;
    features: Feature<LineString, RouteFeatureProperties>[];
    distance: number;
    type: "Run" | "Ride" | "Walk";
    date: string;
}
