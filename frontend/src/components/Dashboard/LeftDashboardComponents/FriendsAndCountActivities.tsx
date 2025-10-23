import { Separator } from "@/components/ui/separator";
const FriendsAndCountActivities = ({
    following,
    followers,
    activities,
}: {
    following: number;
    followers: number;
    activities: number;
}) => {
    return (
        <>
            <div className="flex justify-around text-center">
                <div className=" flex flex-col gap-2 -2">
                    <p>Following</p>
                    <p className="text-3xl font-bold">{following}</p>
                </div>
                <Separator orientation="vertical" />
                <div className=" flex flex-col gap-2">
                    <p>Followers</p>
                    <p className="text-3xl font-bold">{followers}</p>
                </div>
                <Separator orientation="vertical" />
                <div className=" flex flex-col gap-2">
                    <p>Activities</p>
                    <p className="text-3xl font-bold">{activities}</p>
                </div>
            </div>
            <Separator />
        </>
    );
};
export default FriendsAndCountActivities;
