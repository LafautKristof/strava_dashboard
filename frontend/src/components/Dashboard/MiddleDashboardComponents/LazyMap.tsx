"use client";
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("./Map"), { ssr: false });

export default function LazyMap({ route }: { route?: string }) {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

    return (
        <div ref={ref} style={{ height: "400px", width: "100%" }}>
            {inView ? (
                <Map route={route} />
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    🗺️ Kaart wordt geladen...
                </div>
            )}
        </div>
    );
}
