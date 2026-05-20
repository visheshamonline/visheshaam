import { cn } from '@/lib/cn';

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-100 dark:bg-[#1a1a1a] rounded', className)} />;
}

export function ArticleCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[16/9] w-full mb-3" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-5 w-full mb-1" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
