import Link from "next/link";

const Name = ({ name }: { name: string }) => {
    return (
        <Link href={`/athlete/`} className="text-xl font-bold">
            {name}
        </Link>
    );
};
export default Name;
