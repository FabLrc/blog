import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <article className="max-w-4xl mx-auto lg:mx-0 w-full">
          {/* Header skeleton */}
          <header className="mb-8">
            {/* Categories */}
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            {/* Title */}
            <Skeleton className="h-12 w-full mb-3" />
            <Skeleton className="h-12 w-3/4 mb-6" />

            {/* Author and date */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-8 w-px" />
              <Skeleton className="h-4 w-20" />
            </div>
          </header>

          {/* Featured image skeleton */}
          <Skeleton className="w-full h-[500px] rounded-xl mb-12" />

          {/* Social share mobile skeleton */}
          <div className="xl:hidden mb-6 flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2 flex-1">
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 flex-1 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>

          {/* Table of contents skeleton */}
          <div className="lg:hidden mb-8 p-4 bg-muted rounded-lg">
            <Skeleton className="h-5 w-40 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2 ml-4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2 ml-4" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-8 w-1/2 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full rounded-lg mt-4" />
            <Skeleton className="h-4 w-full mt-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-2/5 mt-8" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Navigation skeleton */}
          <div className="mt-12 pt-8 border-t flex justify-between">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex flex-col gap-2 items-end">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </article>

        {/* Sidebar skeleton */}
        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <div className="border rounded-lg p-4">
              <Skeleton className="h-5 w-24 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
