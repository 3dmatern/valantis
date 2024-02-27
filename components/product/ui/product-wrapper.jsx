import { cn } from "@/lib/utils";

export function ProductWrapper({ className, children }) {
    return (
        <div
            className={cn(
                "grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
}
