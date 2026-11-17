import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Download, Paperclip, Pencil, Trash2 } from 'lucide-react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import Heading from '@/components/heading';
import PaymentStatusBadge from '@/components/payment-status-badge';
import { Button } from '@/components/ui/button';
import { formatDate, formatMoney } from '@/lib/expenses';

function Detail({ label, children }) {
    return (
        <div className="grid gap-1">
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="text-sm">{children || '—'}</dd>
        </div>
    );
}

export default function ShowExpense({ expense }) {
    const deleteExpense = () => {
        if (!confirm(`Delete "${expense.title}"? You can restore it later.`)) {
            return;
        }

        router.delete(ExpenseController.destroy.url(expense.id));
    };

    return (
        <>
            <Head title={expense.title} />

            <div className="flex max-w-3xl flex-col gap-6 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title={expense.title}
                        description={expense.reference_number}
                    />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={ExpenseController.index()}>
                                <ArrowLeft /> Back
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={ExpenseController.edit(expense.id)}>
                                <Pencil /> Edit
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={deleteExpense}>
                            <Trash2 /> Delete
                        </Button>
                    </div>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <div className="text-sm text-muted-foreground">
                                Amount
                            </div>
                            <div className="text-3xl font-semibold tabular-nums">
                                {formatMoney(expense.amount)}
                            </div>
                        </div>
                        <PaymentStatusBadge status={expense.payment_status} />
                    </div>

                    <dl className="grid gap-6 sm:grid-cols-2">
                        <Detail label="Category">
                            {expense.category?.name}
                        </Detail>
                        <Detail label="Expense date">
                            {formatDate(expense.expense_date)}
                        </Detail>
                        <Detail label="Payment method">
                            {expense.payment_method_label}
                        </Detail>
                        <Detail label="Payment status">
                            {expense.payment_status_label}
                        </Detail>
                        <Detail label="Recorded by">
                            {expense.creator?.name}
                        </Detail>
                        <Detail label="Recorded on">
                            {new Date(expense.created_at).toLocaleString()}
                        </Detail>
                        <div className="sm:col-span-2">
                            <Detail label="Description">
                                {expense.description && (
                                    <p className="whitespace-pre-line">
                                        {expense.description}
                                    </p>
                                )}
                            </Detail>
                        </div>
                        <div className="sm:col-span-2">
                            <Detail label="Notes">
                                {expense.notes && (
                                    <p className="whitespace-pre-line">
                                        {expense.notes}
                                    </p>
                                )}
                            </Detail>
                        </div>
                        <div className="sm:col-span-2">
                            <Detail label="Receipt / supporting document">
                                {expense.attachment_name && (
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1">
                                            <Paperclip className="size-4" />
                                            {expense.attachment_name}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={ExpenseController.attachment.url(
                                                    expense.id,
                                                )}
                                            >
                                                <Download /> Download
                                            </a>
                                        </Button>
                                    </div>
                                )}
                            </Detail>
                        </div>
                    </dl>
                </div>
            </div>
        </>
    );
}

ShowExpense.layout = {
    breadcrumbs: [
        { title: 'Expenses', href: ExpenseController.index() },
        { title: 'Details', href: ExpenseController.index() },
    ],
};
