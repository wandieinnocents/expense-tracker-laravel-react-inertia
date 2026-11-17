import { Head, Link, router } from '@inertiajs/react';
import {
    ArchiveRestore,
    Eye,
    Paperclip,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import Heading from '@/components/heading';
import NativeSelect from '@/components/native-select';
import Pagination from '@/components/pagination';
import PaymentStatusBadge from '@/components/payment-status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDate, formatMoney } from '@/lib/expenses';

const emptyFilters = {
    search: '',
    category: '',
    status: '',
    date_from: '',
    date_to: '',
    trashed: '',
};

export default function Expenses({
    expenses,
    filters,
    categories,
    paymentStatuses,
}) {
    const [values, setValues] = useState({
        ...emptyFilters,
        ...Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [key, value ?? '']),
        ),
    });
    const trashed = values.trashed === 'only';

    const visit = (next) => {
        const query = Object.fromEntries(
            Object.entries(next).filter(([, value]) => value !== ''),
        );

        router.get(ExpenseController.index.url(), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const update = (key, value, submit = true) => {
        const next = { ...values, [key]: value };
        setValues(next);

        if (submit) {
            visit(next);
        }
    };

    const hasFilters = Object.entries(values).some(
        ([key, value]) => key !== 'trashed' && value !== '',
    );

    const deleteExpense = (expense) => {
        if (!confirm(`Delete "${expense.title}"? You can restore it later.`)) {
            return;
        }

        router.delete(ExpenseController.destroy.url(expense.id), {
            preserveScroll: true,
        });
    };

    const restoreExpense = (expense) => {
        router.patch(
            ExpenseController.restore.url(expense.id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Expenses" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Expenses"
                        description="Record and track business expenses"
                    />
                    <Button asChild>
                        <Link href={ExpenseController.create()}>
                            <Plus /> Record expense
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-3 rounded-xl border border-sidebar-border/70 p-4 sm:grid-cols-2 lg:grid-cols-6 dark:border-sidebar-border">
                    <form
                        className="grid gap-1.5 sm:col-span-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            visit(values);
                        }}
                    >
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="search"
                                type="search"
                                value={values.search}
                                onChange={(e) =>
                                    update('search', e.target.value, false)
                                }
                                placeholder="Title or reference"
                                className="pl-9"
                            />
                        </div>
                    </form>
                    <div className="grid gap-1.5">
                        <Label htmlFor="category">Category</Label>
                        <NativeSelect
                            id="category"
                            value={values.category}
                            onChange={(e) => update('category', e.target.value)}
                            placeholder="All categories"
                            options={categories}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="status">Status</Label>
                        <NativeSelect
                            id="status"
                            value={values.status}
                            onChange={(e) => update('status', e.target.value)}
                            placeholder="All statuses"
                            options={paymentStatuses}
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="date_from">From</Label>
                        <Input
                            id="date_from"
                            type="date"
                            value={values.date_from}
                            max={values.date_to || undefined}
                            onChange={(e) =>
                                update('date_from', e.target.value)
                            }
                        />
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="date_to">To</Label>
                        <Input
                            id="date_to"
                            type="date"
                            value={values.date_to}
                            min={values.date_from || undefined}
                            onChange={(e) => update('date_to', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:col-span-2 lg:col-span-6">
                        <div className="flex gap-1">
                            <Button
                                variant={trashed ? 'ghost' : 'secondary'}
                                size="sm"
                                onClick={() => update('trashed', '')}
                            >
                                Active
                            </Button>
                            <Button
                                variant={trashed ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => update('trashed', 'only')}
                            >
                                Deleted
                            </Button>
                        </div>
                        {hasFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    const next = {
                                        ...emptyFilters,
                                        trashed: values.trashed,
                                    };
                                    setValues(next);
                                    visit(next);
                                }}
                            >
                                <X /> Clear filters
                            </Button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">
                                    Expense
                                </th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Amount
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No expenses found.
                                    </td>
                                </tr>
                            ) : (
                                expenses.data.map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="border-t border-sidebar-border/70 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {formatDate(expense.expense_date)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1 font-medium">
                                                {expense.title}
                                                {expense.attachment && (
                                                    <Paperclip
                                                        className="size-3.5 text-muted-foreground"
                                                        aria-label="Has attachment"
                                                    />
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {expense.reference_number}
                                            </div>
                                        </td>
                                        <td className="hidden px-4 py-3 md:table-cell">
                                            {expense.category?.name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap tabular-nums">
                                            {formatMoney(expense.amount)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <PaymentStatusBadge
                                                status={expense.payment_status}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {expense.deleted_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            restoreExpense(
                                                                expense,
                                                            )
                                                        }
                                                    >
                                                        <ArchiveRestore />{' '}
                                                        Restore
                                                    </Button>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={ExpenseController.show(
                                                                    expense.id,
                                                                )}
                                                                aria-label="View"
                                                            >
                                                                <Eye />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={ExpenseController.edit(
                                                                    expense.id,
                                                                )}
                                                                aria-label="Edit"
                                                            >
                                                                <Pencil />
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            aria-label="Delete"
                                                            onClick={() =>
                                                                deleteExpense(
                                                                    expense,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination paginator={expenses} label="expenses" />
            </div>
        </>
    );
}

Expenses.layout = {
    breadcrumbs: [{ title: 'Expenses', href: ExpenseController.index() }],
};
