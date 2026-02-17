import GearOverviewPage from "../page";

export default async function GearPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    console.log("params", id);
    return <GearOverviewPage initialOpenGearId={id} />;
}
