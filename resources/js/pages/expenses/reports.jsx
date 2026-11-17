import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    CalendarRange,
    CircleCheck,
    CircleDashed,
    CircleX,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import ExpenseReportController from '@/actions/App/Http/Controllers/ExpenseReportController';
import Heading from '@/components/heading';
import NativeSelect from '@/components/native-select';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatMoney } from '@/lib/expenses';

const emptyFilters = {
    start_date: '',
    end_date: '',
    category: '',
    status: '',
};

export default function ExpenseReports({
    summary,
    report,
    filters,
    categories,
    paymentStatuses,
}) {
    const [values, setValues] = useState({
        ...emptyFilters,
        ...Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [
                key,
                value == null ? '' : String(value),
            ]),
        ),
    });

    const visit = (next) => {
        router.get(
            ExpenseReportController.url(),
            Object.fromEntries(
                Object.entries(next).filter(([, value]) => value !== ''),
            ),
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const submit = (e) => {
        e.preventDefault();
        visit(values);
    };

    const reset = () => {
        setValues(emptyFilters);
        visit(emptyFilters);
    };

    const set = (key) => (e) =>
        setValues((current) => ({ ...current, [key]: e.target.value }));

    const reportTotal = report.total.amount;

    return (
        <>
            <Head title="Expense reports" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <Heading
                    title="Expense reports"
                    description="Summary of recorded expenses"
                />

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Total expenses"
                        icon={Wallet}
                        {...summary.total}
                    />
                    <StatCard
                        title="This month"
                        icon={CalendarDays}
                        {...summary.this_month}
                    />
                    <StatCard
                        title="This year"
                        icon={CalendarRange}
                        {...summary.this_year}
                    />
                    <StatCard
                        title="Paid"
                        icon={CircleCheck}
                        {...summary.paid}
                    />
                    <StatCard
                        title="Unpaid"
                        icon={CircleX}
                        {...summary.unpaid}
                    />
                    <StatCard
                        title="Partially paid"
                        icon={CircleDashed}
                        {...summary.partial}
                    />
                </section>

                <section className="flex flex-col gap-4">
                    <Heading
                        variant="small"
                        title="Filtered report"
                        description="Narrow the breakdown by date range, category and payment status"
                    />

                    <form
                        onSubmit={submit}
                        className="grid gap-3 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 lg:grid-cols-5 dark:border-sidebar-border"
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="start_date">Start date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={values.start_date}
                                max={values.end_date || undefined}
                                onChange={set('start_date')}
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="end_date">End date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={values.end_date}
                                min={values.start_date || undefined}
                                onChange={set('end_date')}
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="category">Category</Label>
                            <NativeSelect
                                id="category"
                                value={values.category}
                                onChange={set('category')}
                                placeholder="All categories"
                                options={categories}
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="status">Payment status</Label>
                            <NativeSelect
                                id="status"
                                value={values.status}
                                onChange={set('status')}
                                placeholder="All statuses"
                                options={paymentStatuses}
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button type="submit">Apply</Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={reset}
                            >
                                Reset
                            </Button>
                        </div>
                    </form>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard title="Total" {...report.total} />
                        <StatCard title="Paid" {...report.paid} />
                        <StatCard title="Unpaid" {...report.unpaid} />
                        <StatCard title="Partially paid" {...report.partial} />
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3 font-medium">
                                        Category
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Expenses
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Amount
                                    </th>
                                    <th className="hidden w-1/3 px-4 py-3 font-medium sm:table-cell">
                                        Share
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.by_category.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-4 py-6 text-center text-muted-foreground"
                                        >
                                            No expenses match these filters.
                                        </td>
                                    </tr>
                                ) : (
                                    report.by_category.map((row) => {
                                        const share =
                                            reportTotal > 0
                                                ? (row.amount / reportTotal) *
                                                  100
                                                : 0;

                                        return (
                                            <tr
                                                key={row.id}
                                                className="border-t border-sidebar-border/70 dark:border-sidebar-border"
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {row.name}
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums">
                                                    {row.count}
                                                </td>
                                                <td className="px-4 py-3 text-right tabular-nums">
                                                    {formatMoney(row.amount)}
                                                </td>
                                                <td className="hidden px-4 py-3 sm:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-primary"
                                                                style={{
                                                                    width: `${share}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="w-12 text-right text-xs text-muted-foreground tabular-nums">
                                                            {share.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            {report.by_category.length > 0 && (
                                <tfoot className="border-t border-sidebar-border/70 font-medium dark:border-sidebar-border">
                                    <tr>
                                        <td className="px-4 py-3">Total</td>
                                        <td className="px-4 py-3 text-right tabular-nums">
                                            {report.total.count}
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums">
                                            {formatMoney(reportTotal)}
                                        </td>
                                        <td className="hidden sm:table-cell" />
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </section>
            </div>
        </>
    );
}

ExpenseReports.layout = {
    breadcrumbs: [
        { title: 'Expenses', href: ExpenseController.index() },
        { title: 'Reports', href: ExpenseReportController() },
    ],
};
