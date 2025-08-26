import { cn } from "@/lib/utils"

function FastSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  )
}

// Pre-built common skeleton components for faster rendering
export const MetricSkeleton = () => (
  <FastSkeleton className="h-8 w-20 rounded-lg" />
);

export const CardSkeleton = () => (
  <div className="space-y-3">
    <FastSkeleton className="h-4 w-3/4" />
    <FastSkeleton className="h-3 w-1/2" />
    <FastSkeleton className="h-20 w-full" />
  </div>
);

export const TableRowSkeleton = () => (
  <FastSkeleton className="h-12 w-full rounded-md" />
);

export const PropertyCardSkeleton = () => (
  <div className="space-y-2">
    <FastSkeleton className="h-4 w-3/4" />
    <FastSkeleton className="h-3 w-1/2" />
    <FastSkeleton className="h-16 w-full" />
  </div>
);

export { FastSkeleton };