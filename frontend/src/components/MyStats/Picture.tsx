import Image from "next/image";

const Picture = ({ picture }: { picture: string | null }) => {
    return (
        <div className="relative w-24 h-28 ">
            <div className="flex items-center gap-3 mb-2">
                <Image
                    src={picture ?? "/Portrait_Placeholder.png"}
                    alt="Athlete profile"
                    width={100}
                    height={100}
                    className="rounded-full  border-amber-800 border-4"
                />
            </div>
        </div>
    );
};
export default Picture;
