"use client";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function LazyMap({
    route,
    small = false,
}: {
    route?: string;
    small?: boolean;
}) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div
            ref={ref}
            className={`w-full ${small ? "h-[100px]" : "h-[400px]"} ${
                small ? "pointer-events-none rounded-md overflow-hidden" : ""
            }`}
        >
            {inView ? (
                <Map route={route} small={small} />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Map is loading...
                </div>
            )}
        </div>
    );
}
