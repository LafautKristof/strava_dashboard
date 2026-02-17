"use client";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function LazyMap({
    route,
    small = false,
    activitieType,
}: {
    route?: string;
    small?: boolean;
    activitieType?: string;
}) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`w-full ${small ? "h-12.5" : "h-100"} ${
                small ? "pointer-events-none rounded-md overflow-hidden" : ""
            } relative z-0`}
        >
            {inView ? (
                <Map
                    route={route}
                    small={small}
                    activitieType={activitieType}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Map is loading...
                </div>
            )}
        </div>
    );
}
