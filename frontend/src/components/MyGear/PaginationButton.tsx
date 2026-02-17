import { Pagination } from "@/app/types/pagination";
import { Button } from "../ui/button";

const PaginationButton = ({
    activitiesPage,
    setActivitiesPage,
    activitiesPagination,
}: {
    activitiesPage: number;
    setActivitiesPage: (page: number) => void;
    activitiesPagination: Pagination;
}) => {
    return (
        <>
            <Button
                disabled={activitiesPage === 1}
                onClick={() => setActivitiesPage(activitiesPage - 1)}
                className={`px-6 transition-colors
        ${
            activitiesPage === 1
                ? "bg-gray-200 text-orange-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-amber-500"
        }`}
            >
                Previous
            </Button>

            <span className="text-sm text-gray-500">
                Page {activitiesPagination.page} of{" "}
                {activitiesPagination.total_pages}
            </span>

            <Button
                disabled={activitiesPage === activitiesPagination.total_pages}
                onClick={() => setActivitiesPage(activitiesPage + 1)}
                className={`px-6 transition-colors
        ${
            activitiesPage === activitiesPagination.total_pages
                ? "bg-gray-200 text-orange-600 cursor-not-allowed"
                : "bg-orange-500 hover:bg-amber-500"
        }`}
            >
                Next
            </Button>
        </>
    );
};
export default PaginationButton;
