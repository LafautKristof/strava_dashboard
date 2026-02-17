"use client";

import React from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";

import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

export function getTypeMarker(type: string): L.DivIcon {
    let iconElement: React.ReactElement;

    switch (type) {
        case "Run":
            iconElement = (
                <DirectionsRunRoundedIcon
                    style={{ color: "#f97316" }}
                    fontSize="small"
                />
            );
            break;
        case "Walk":
            iconElement = (
                <DirectionsWalkRoundedIcon
                    style={{ color: "#22c55e" }}
                    fontSize="small"
                />
            );
            break;
        case "Ride":
            iconElement = (
                <DirectionsBikeRoundedIcon
                    style={{ color: "#3b82f6" }}
                    fontSize="small"
                />
            );
            break;
        case "Workout":
        case "WeightTraining":
            iconElement = (
                <FitnessCenterRoundedIcon
                    style={{ color: "#a855f7" }}
                    fontSize="small"
                />
            );
            break;
        default:
            iconElement = (
                <DirectionsRunRoundedIcon
                    style={{ color: "#9ca3af" }}
                    fontSize="small"
                />
            );
            break;
    }

    const iconHtml = ReactDOMServer.renderToString(iconElement);

    return L.divIcon({
        html: `<div style="
            width:28px;
            height:28px;
            display:flex;
            align-items:center;
            justify-content:center;
            background:white;
            border-radius:50%;
            box-shadow:0 0 6px rgba(0,0,0,0.3);
        ">${iconHtml}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        className: "",
    });
}
