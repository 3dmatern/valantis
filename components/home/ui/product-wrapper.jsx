import { cn } from "@/lib/utils";

export function ProductWrapper({ className, children }) {
    return (
        <div className={cn("grid grid-cols-5 gap-4", className)}>
            {children}
        </div>
    );
}
