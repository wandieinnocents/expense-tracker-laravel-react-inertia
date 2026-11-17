import { formatMoney } from '@/lib/expenses';

export default function StatCard({ title, amount, count, icon: Icon }) {
    return (
        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{title}</span>
                {Icon && <Icon className="size-4" />}
            </div>
            <div className="mt-2 text-2xl font-semibold tabular-nums">
                {formatMoney(amount)}
            </div>
            <div className="text-xs text-muted-foreground">
                {count} {count === 1 ? 'expense' : 'expenses'}
            </div>
        </div>
    );
}
