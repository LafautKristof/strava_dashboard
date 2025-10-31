import { Gear } from "@/app/types/activities";

const MyGear = ({ gear, device }: { gear?: Gear; device?: string }) => {
    return (
        <>
            <div className="flex justify-between text-sm font-semibold mt-4 mb-4">
                {device && <p>{device}</p>} {gear && <p>Shoes: {gear.name}</p>}
            </div>
        </>
    );
};
export default MyGear;
