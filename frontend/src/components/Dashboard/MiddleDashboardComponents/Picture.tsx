import Image from "next/image";

const Picture = ({ picture }: { picture: string | null }) => {
    return (
        <div className="relative w-16 h-24">
            <div className="flex items-center gap-3 mb-2">
                <Image
                    src={picture ?? "/Portrait_Placeholder.png"}
                    alt="Athlete profile"
                    width={80}
                    height={80}
                    className="rounded-full border border-gray-300"
                />
            </div>
        </div>
    );
};
export default Picture;
