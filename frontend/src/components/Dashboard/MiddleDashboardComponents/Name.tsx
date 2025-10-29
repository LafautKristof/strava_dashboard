import Link from "next/link";

const Name = ({ name }: { name: string }) => {
    return (
        <Link href={`/mystats`} className="text-xl font-bold">
            {name}
        </Link>
    );
};
export default Name;
