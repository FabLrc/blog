import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ArticleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="h-60 w-full rounded-none" />
      <CardHeader>
        {/* Category badges */}
        <div className="mb-2 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        {/* Title */}
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        {/* Date and reading time */}
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        {/* Excerpt */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  );
}

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
        </div>

        {/* Header skeleton */}
        <div className="mb-12 text-center">
          <Skeleton className="h-10 w-32 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto mb-2" />
          <Skeleton className="h-5 w-64 max-w-full mx-auto" />
        </div>

        {/* Filter skeleton */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>

        {/* Articles grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
