import {
    WiDaySunny,
    WiDayCloudy,
    WiCloud,
    WiRain,
    WiShowers,
    WiThunderstorm,
    WiSnow,
    WiFog,
} from "react-icons/wi";

export function getWeatherIcon(condition: string) {
    const lower = condition.toLowerCase();

    if (lower.includes("clear"))
        return <WiDaySunny className="text-yellow-400 text-2xl" />;
    if (lower.includes("partly"))
        return <WiDayCloudy className="text-yellow-300 text-2xl" />;
    if (lower.includes("cloud"))
        return <WiCloud className="text-gray-400 text-2xl" />;
    if (lower.includes("rain"))
        return <WiRain className="text-blue-400 text-2xl" />;
    if (lower.includes("shower"))
        return <WiShowers className="text-blue-500 text-2xl" />;
    if (lower.includes("storm") || lower.includes("thunder"))
        return <WiThunderstorm className="text-purple-500 text-2xl" />;
    if (lower.includes("snow"))
        return <WiSnow className="text-sky-300 text-2xl" />;
    if (lower.includes("fog") || lower.includes("mist"))
        return <WiFog className="text-gray-300 text-2xl" />;

    return <WiDayCloudy className="text-gray-400 text-2xl" />;
}
