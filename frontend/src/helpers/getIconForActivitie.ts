import {
    DirectionsRun as DirectionsRunIcon,
    DirectionsBike as DirectionsBikeIcon,
    DirectionsWalk as DirectionsWalkIcon,
    FitnessCenter as FitnessCenterIcon,
} from "@mui/icons-material";
import type { SvgIconProps } from "@mui/material";

export type ActivityType = "Run" | "Ride" | "Walk" | "Workout" | string;

export function getIconComponentForActivity(
    type: ActivityType
): React.ElementType<SvgIconProps> {
    switch (type) {
        case "Run":
            return DirectionsRunIcon;
        case "Ride":
            return DirectionsBikeIcon;
        case "Walk":
            return DirectionsWalkIcon;
        case "Workout":
            return FitnessCenterIcon;
        default:
            return DirectionsRunIcon;
    }
}
