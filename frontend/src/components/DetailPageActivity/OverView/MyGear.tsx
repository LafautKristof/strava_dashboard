import { Gear } from "@/types/activity";
import Link from "next/link";

const MyGear = ({ gear, device }: { gear?: Gear; device?: string }) => {
    return (
        <>
            <div className="flex justify-between text-sm font-semibold mt-4 mb-4">
                {device && <p>{device}</p>}{" "}
                {gear && (
                    <p>
                        Shoes:{" "}
                        <Link
                            className="text-orange-300 font-bold hover:text-orange-500"
                            href={`/mygear/${gear.id}`}
                        >
                            {gear.name}
                        </Link>
                    </p>
                )}
            </div>
        </>
    );
};
export default MyGear;
