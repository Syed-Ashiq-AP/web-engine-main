import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
    const _values = React.useMemo(
        () =>
            Array.isArray(value)
                ? value
                : Array.isArray(defaultValue)
                ? defaultValue
                : [min, max],
        [value, defaultValue, min, max]
    );

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            defaultValue={defaultValue}
            value={value}
            min={min}
            max={max}
            className={cn(
                "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 h-full",
                className
            )}
            {...props}
        >
            <SliderPrimitive.Track
                data-slot="slider-track"
                className={cn(
                    " relative grow overflow-hidden rounded-full  h-full"
                )}
            >
                <SliderPrimitive.Range
                    data-slot="slider-range"
                    className={cn(
                        "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
                    )}
                />
            </SliderPrimitive.Track>
            {Array.from({ length: _values.length }, (_, index) => (
                <div className="we-time-slider" key={index}>
                    <SliderPrimitive.Thumb
                        data-slot="slider-thumb"
                        className="we-slide-grabber"
                    >
                        <span className="absolute left-0 right-0 mx-auto h-[50px] w-[1px] bg-blue-500"></span>
                    </SliderPrimitive.Thumb>
                </div>
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
