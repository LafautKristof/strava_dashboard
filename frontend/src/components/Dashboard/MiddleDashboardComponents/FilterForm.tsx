import { CalendarIcon, SlidersHorizontal } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTitle,
    DrawerTrigger,
} from "../../ui/drawer";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Slider } from "../../ui/slider";
import { getTimeInHoursMinutes2 } from "@/src/helpers/formatDateAndTime";

const FilterForm = ({
    onFilterName,
    name,
    onFilterDateRange,
    dateRange,
    onFilterType,
    type,
    onReset,
    onFilterDistance,
    minDistance,
    maxDistance,
    onFilterTime,
    minTime,
    maxTime,
    activeFilterCount,
    gear,
    onFilterGear,
}: {
    onFilterName: (name: string) => void;
    name: string;
    onFilterDateRange: (dateRange: DateRange | undefined) => void;
    dateRange: DateRange | undefined;
    onFilterType: (type: string) => void;
    type: string;
    onReset: () => void;
    onFilterDistance: ({ min, max }: { min: number; max: number }) => void;
    minDistance: number;
    maxDistance: number;
    onFilterTime: ({ min, max }: { min: number; max: number }) => void;
    minTime: number;
    maxTime: number;
    activeFilterCount: number;
    gear: { id: string; name: string } | null;
    onFilterGear: (id: string, name: string) => void;
}) => {
    const types = ["All", "Ride", "Run", "Walk", "Workout"];
    const gears = [
        { name: "Saucony Triumph 23", id: "g26339182" },
        { name: "Brooks Glyceryn 22", id: "g26339175" },
    ];
    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 relative"
                >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-2 py-0.5">
                            {activeFilterCount}
                        </span>
                    )}
                </Button>
            </DrawerTrigger>

            <DrawerContent className="p-6 max-w-sm bg-orange-100">
                {/* <VisuallyHidden> */}
                <DrawerTitle>Filter Activities</DrawerTitle>
                {/* </VisuallyHidden> */}
                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 hover:bg-amber-500 cursor-pointer "
                    >
                        ✕
                    </Button>
                </DrawerClose>
                <div className="space-y-6 mt-6">
                    {/* NAME */}
                    <div>
                        <Label className="mb-2 block text-sm">Search</Label>
                        <Input
                            value={name}
                            onChange={(e) => onFilterName(e.target.value)}
                            placeholder="Search by title..."
                            className="bg-orange-400 text-white placeholder:text-white cursor-pointer"
                        />
                    </div>
                    <Separator className="my-4" />
                    {/* DATE */}
                    <div>
                        <Label className="mb-2 block text-sm">Date</Label>
                        <Popover>
                            <PopoverTrigger asChild className="">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-orange-400 text-gray-50 hover:bg-orange-400 hover:text-white cursor-pointer"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4 hover:text-white cursor-pointer" />
                                    {dateRange?.from && dateRange?.to
                                        ? `${format(dateRange.from, "MMM dd, yyyy")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                                        : "Select a date range"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 cursor-pointer">
                                <Calendar
                                    mode="range"
                                    className="cursor-pointer"
                                    selected={dateRange}
                                    onSelect={(range) => {
                                        onFilterDateRange(
                                            range ?? {
                                                from: undefined,
                                                to: undefined,
                                            },
                                        );
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Separator className="my-4" />
                    {/* TYPE */}
                    <div>
                        <Label className="mb-2 block text-sm">
                            Activity Type
                        </Label>
                        <RadioGroup
                            value={type}
                            onValueChange={(value) => onFilterType(value)}
                            className="flex flex-wrap gap-4  "
                        >
                            {types.map((t) => (
                                <div
                                    key={t}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem
                                        value={t}
                                        id={t}
                                        className=" border-orange-500
        data-[state=checked]:border-orange-500
        data-[state=checked]:bg-orange-500
        data-[state=checked]:text-white
        data-[state=checked]:[&>span]:bg-white cursor-pointer"
                                    />
                                    <Label htmlFor={t}>{t}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                    <Separator className="my-4" />
                    {/* MIN DISTANCE AND MAX DISTANCE */}
                    <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <Label className="mb-2 block text-sm">Distance</Label>
                        <Slider
                            value={[minDistance, maxDistance]}
                            min={0}
                            max={100000}
                            step={500}
                            className="mx-auto w-full max-w-xs cursor-pointer"
                            onValueChange={(values) =>
                                onFilterDistance({
                                    min: values[0],
                                    max: values[1],
                                })
                            }
                        />{" "}
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{minDistance / 1000} km</span>
                            <span>{maxDistance / 1000} km</span>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    {/* TIME */}
                    <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        <Label className="mb-2 block text-sm">Duration</Label>
                        <Slider
                            value={[minTime, maxTime]}
                            max={28800}
                            step={120}
                            className="mx-auto w-full max-w-xs cursor-pointer"
                            onValueChange={(value) => {
                                onFilterTime({ min: value[0], max: value[1] });
                            }}
                        />{" "}
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{getTimeInHoursMinutes2(minTime)}</span>
                            <span>{getTimeInHoursMinutes2(maxTime)}</span>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div>
                        <Label className="mb-2 block text-sm">Gear</Label>
                        <RadioGroup
                            value={gear?.id ?? ""}
                            onValueChange={(value) => {
                                const selected = gears.find(
                                    (g) => g.id === value,
                                );
                                if (selected) {
                                    onFilterGear(selected.id, selected.name);
                                }
                            }}
                            className="flex flex-wrap gap-4"
                        >
                            {gears.map((g) => (
                                <div
                                    key={g.id}
                                    className="flex items-center space-x-2"
                                >
                                    <RadioGroupItem
                                        value={g.id}
                                        id={g.id}
                                        className="
        border-orange-500
        data-[state=checked]:border-orange-500
        data-[state=checked]:bg-orange-500
        data-[state=checked]:text-white
        data-[state=checked]:[&>span]:bg-white cursor-pointer
    "
                                    />
                                    <Label htmlFor={g.id}>{g.name}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>

                <DrawerFooter className="mt-8">
                    <Button
                        className="w-full mt-4 bg-orange-500 hover:bg-amber-500
       "
                        onClick={() => {
                            onReset();
                        }}
                    >
                        Clear Filters
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
};
export default FilterForm;
