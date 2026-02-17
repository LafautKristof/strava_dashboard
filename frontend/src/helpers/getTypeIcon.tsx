"use client";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

export type SvgIconPropsSizeOverrides =
    | "small"
    | "inherit"
    | "large"
    | "medium";
export function getTypeIcon(type: string, fontSize: SvgIconPropsSizeOverrides) {
    switch (type) {
        case "Run":
            return (
                <DirectionsRunRoundedIcon
                    className="text-orange-500"
                    fontSize={fontSize}
                />
            );
        case "Walk":
            return (
                <DirectionsWalkRoundedIcon
                    className="text-green-500"
                    fontSize={fontSize}
                />
            );
        case "Ride":
            return (
                <DirectionsBikeRoundedIcon
                    className="text-blue-500"
                    fontSize={fontSize}
                />
            );
        case "Workout":
        case "WeightTraining":
            return (
                <FitnessCenterRoundedIcon
                    className="text-purple-500"
                    fontSize={fontSize}
                />
            );
        default:
            return (
                <DirectionsRunRoundedIcon
                    className="text-gray-400"
                    fontSize="small"
                />
            );
    }
}
