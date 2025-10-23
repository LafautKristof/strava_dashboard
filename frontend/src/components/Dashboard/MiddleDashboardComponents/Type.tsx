import DirectionsRunRoundedIcon from "@mui/icons-material/DirectionsRunRounded";
import DirectionsWalkRoundedIcon from "@mui/icons-material/DirectionsWalkRounded";
import DirectionsBikeRoundedIcon from "@mui/icons-material/DirectionsBikeRounded";
import FitnessCenterRoundedIcon from "@mui/icons-material/FitnessCenterRounded";

const Type = ({ type }: { type: string }) => {
    return (
        <>
            <div className="text-3xl">
                {type === "Run" && (
                    <DirectionsRunRoundedIcon fontSize="large" />
                )}
                {type === "Walk" && (
                    <DirectionsWalkRoundedIcon fontSize="large" />
                )}
                {type === "Ride" && (
                    <DirectionsBikeRoundedIcon fontSize="large" />
                )}
                {(type === "Workout" || type === "WeightTraining") && (
                    <FitnessCenterRoundedIcon fontSize="large" />
                )}
            </div>
        </>
    );
};

export default Type;
