import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

import { GearData } from "@/app/types/gear";

const CardButton = ({
    isSelected,
    setSelectedGear,
    setActivitiesPage,
    gear: g,
}: {
    isSelected: boolean;
    setSelectedGear: (id: string | null) => void;
    setActivitiesPage: (page: number) => void;
    gear: GearData;
}) => {
    return (
        <Button
            variant="outline"
            onClick={() => {
                if (isSelected) {
                    setSelectedGear(null);
                } else {
                    setSelectedGear(g.id);
                    setActivitiesPage(1);
                }
            }}
        >
            {isSelected ? "Sluiten" : "View activities"}
            <ChevronDown
                className={`ml-2 h-4 w-4 transition-transform ${
                    isSelected ? "rotate-180" : ""
                }`}
            />
        </Button>
    );
};
export default CardButton;
