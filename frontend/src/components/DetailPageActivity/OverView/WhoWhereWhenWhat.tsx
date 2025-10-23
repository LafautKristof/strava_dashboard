import Image from "next/image";

const WhoWhereWhenWhat = ({
    who,
    where1,
    when,
    what,
    description,
}: {
    who: string | null;
    where1: string | null;
    when: string | null;
    what: string | null;
    description: string | null;
}) => {
    return (
        <div className="bg-white  p-4 mt-4 text-gray-800  flex gap-4 text-xs">
            <div className="flex items-center gap-3 mb-2">
                <Image
                    src={who ?? "Portrait_Placeholder.png"}
                    alt="Athlete profile"
                    width={80}
                    height={80}
                    className="rounded-full border border-gray-300"
                />
            </div>
            <div>
                <div className="flex gap-2.5">
                    {when} - {where1}
                </div>
                <div className="text-3xl font-bold mb-1.5">{what}</div>
                <div className="font-semibold">{description}</div>
            </div>
        </div>
    );
};

export default WhoWhereWhenWhat;
