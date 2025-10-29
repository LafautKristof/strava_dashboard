"use client";
import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

export function getTypeIcon(type: string) {
    switch (type) {
        case "Run":
            return (
                <DirectionsRunRoundedIcon
                    className="text-orange-500"
                    fontSize="small"
                />
            );
        case "Walk":
            return (
                <DirectionsWalkRoundedIcon
                    className="text-green-500"
                    fontSize="small"
                />
            );
        case "Ride":
            return (
                <DirectionsBikeRoundedIcon
                    className="text-blue-500"
                    fontSize="small"
                />
            );
        case "Workout":
        case "WeightTraining":
            return (
                <FitnessCenterRoundedIcon
                    className="text-purple-500"
                    fontSize="small"
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
