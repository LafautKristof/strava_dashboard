import LeftMyRoutesComponent from "@/components/MyRoute/LeftMyRouteComponent/LeftMyRoutesComponent";
import MiddleMyRouteComponent from "@/components/MyRoute/MiddleMyRouteComponent/MiddleMyRouteComponent";

const page = () => {
    return (
        <main className="flex flex-col lg:flex-row w-full min-h-[80vh] items-start gap-6">
            <div className="w-full lg:w-1/3">
                <LeftMyRoutesComponent />
            </div>
            <div className="w-full lg:w-2/3">
                <MiddleMyRouteComponent />
            </div>
        </main>
    );
};
export default page;
