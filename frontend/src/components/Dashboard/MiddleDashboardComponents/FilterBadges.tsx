import { X } from "lucide-react";
import { Badge } from "../../ui/badge";

const FilterBadges = ({
    children,
    onClear,
}: {
    children: React.ReactNode;
    onClear: () => void;
}) => {
    return (
        <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
            {children}
            <button
                onClick={onClear}
                className="hover:text-red-500 transition-colors"
            >
                <X size={14} />
            </button>
        </Badge>
    );
};
export default FilterBadges;
