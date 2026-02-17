"use client";

import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { getTypeIcon } from "@/src/helpers/getTypeIcon";

interface Props {
    name: string;
    setName: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    color: string;
    setColor: (v: string) => void;
    onSave: () => void;
    disabled: boolean;
    type: string;
    setType: (v: "Run" | "Ride" | "Walk") => void;
}

export default function RouteForm({
    name,
    setName,
    description,
    setDescription,
    color,
    setColor,
    onSave,
    disabled,
    type,
    setType,
}: Props) {
    const types = ["Run", "Ride", "Walk"];
    return (
        <>
            <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 space-y-6">
                {/* Header */}
                <div>
                    <h3 className="text-lg font-semibold">
                        Details of the route
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Fill in the details of your route
                    </p>
                </div>

                {/* Row 1 */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name of route"
                            className="bg-orange-200 text-gray-900 placeholder:text-gray-400 cursor-pointer"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-[160px]">
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger className="h-11 w-full bg-orange-200">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {types.map((type) => (
                                            <SelectItem
                                                key={type}
                                                value={type}
                                                className="
    cursor-pointer
    bg-orange-100
    focus:bg-orange-300
    data-[highlighted]:bg-orange-300
    data-[state=checked]:bg-orange-500
    data-[state=checked]:text-white
  "
                                            >
                                                {getTypeIcon(type, "medium")}{" "}
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-3">
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="w-12 h-10 p-1 cursor-pointer bg-orange-200"
                            />
                        </div>
                    </div>
                </div>
                {/* Description */}
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Beschrijving (optioneel)"
                    className="min-h-[100px] bg-orange-200 text-black placeholder:text-gray-400 cursor-pointer"
                />

                {/* Footer */}
                <div className="flex items-center justify-between">
                    {/* Color Picker */}

                    {/* Save Button */}
                    <Button
                        onClick={onSave}
                        disabled={disabled}
                        className={`px-6 w-full mt-4 transition-colors
        ${
            disabled
                ? "bg-gray-400 text-black cursor-not-allowed"
                : "bg-orange-500 hover:bg-amber-500"
        }`}
                    >
                        {disabled ? "Fill in all fields" : "Save route"}
                    </Button>
                </div>
            </div>
        </>
    );
}
