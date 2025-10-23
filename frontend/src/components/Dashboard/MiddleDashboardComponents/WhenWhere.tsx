"use client";
import { formatActivityDate } from "@/helpers/getDate";

const WhenWhere = ({ when, where }: { when: Date; where: string }) => {
    const date = formatActivityDate(when);
    return (
        <div>
            <p className="text-md font-semibold">
                {date} in {where}
            </p>
        </div>
    );
};
export default WhenWhere;
