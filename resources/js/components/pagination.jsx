import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

/**
 * Previous/next controls for a Laravel length-aware paginator.
 */
export default function Pagination({ paginator, label = 'records' }) {
    if (paginator.last_page <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                Page {paginator.current_page} of {paginator.last_page} ·{' '}
                {paginator.total} {label}
            </span>
            <div className="flex gap-2">
                <PageButton url={paginator.prev_page_url}>Previous</PageButton>
                <PageButton url={paginator.next_page_url}>Next</PageButton>
            </div>
        </div>
    );
}

function PageButton({ url, children }) {
    return (
        <Button variant="outline" size="sm" disabled={!url} asChild={!!url}>
            {url ? (
                <Link href={url} preserveScroll preserveState>
                    {children}
                </Link>
            ) : (
                children
            )}
        </Button>
    );
}
