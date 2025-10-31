import { Separator } from "@/components/ui/separator";
import { getWeatherIcon } from "@/helpers/getWeatherIcon";

type Details = {
    distance: string;
    movingTime: string;
    pace: string;
    relativeEffort: number;
    elevation: number;
    elapsedTime: string;
    calories: number;
};

type Weather = {
    condition: string;
    temperature: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    wind_dir: string;
    cloud_cover: number;
};
const Details = ({
    details,
    weather,
}: {
    details: Details[];
    weather?: Weather[];
}) => {
    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-4">
                <div>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl">{details[0].distance} </h2>
                        <p className="text-lg">km</p>
                    </div>
                    <p className="text-xs text-gray-700   ">Distance</p>
                </div>{" "}
                <div>
                    <h2 className="text-2xl">{details[0].movingTime}</h2>
                    <p className="text-xs text-gray-700   ">Moving Time</p>
                </div>{" "}
                <div>
                    <div className="flex items-baseline gap-1">
                        <h2 className="text-2xl">{details[0].pace}</h2>
                        <p className="text-lg"> /km</p>
                    </div>{" "}
                    <p className="text-xs text-gray-700   ">Pace</p>
                </div>
                <div>
                    <h2 className="text-2xl">{details[0].relativeEffort}</h2>
                    <p className="text-xs text-gray-700   ">Relative Effort</p>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 text-sm mt-4 mb-4 ">
                <div className="grid grid-cols-2">
                    <p>Elevation</p>
                    <p className="font-bold ">{details[0].elevation}</p>{" "}
                    <p>Calories</p>
                    <p className="font-bold">{details[0].calories}</p>
                </div>

                <div className="grid grid-cols-2">
                    <p>Elapsed Time</p>
                    <p className="font-bold">{details[0].elapsedTime}</p>
                </div>
            </div>

            {weather && weather.length > 0 && (
                <>
                    {" "}
                    <Separator />
                    <div className="grid grid-cols-2 text-sm mt-4 mb-4 ">
                        <div className="grid grid-cols-2">
                            <p className="font-bold">{weather[0].condition}</p>
                            <p className="font-bold">
                                {getWeatherIcon(weather[0].condition)}
                            </p>
                            <p>Temperature</p>
                            <p className="font-bold">
                                {weather[0].temperature} °C
                            </p>
                            <p>Humidity</p>
                            <p className="font-bold">{weather[0].humidity}%</p>
                        </div>

                        <div className="grid grid-cols-2">
                            <p>Feels Like</p>
                            <p className="font-bold">
                                {weather[0].feels_like} °C
                            </p>
                            <p>Wind Speed</p>
                            <p className="font-bold">
                                {weather[0].wind_speed} km/h
                            </p>
                            <p>Wind Direction</p>
                            <p className="font-bold">{weather[0].wind_dir}</p>
                        </div>
                    </div>
                </>
            )}
            <Separator />
        </>
    );
};
export default Details;
