import { Paperclip } from 'lucide-react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import InputError from '@/components/input-error';
import NativeSelect from '@/components/native-select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const today = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export default function ExpenseFormFields({
    errors,
    expense,
    categories,
    paymentMethods,
    paymentStatuses,
}) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    name="title"
                    defaultValue={expense?.title}
                    required
                    maxLength={255}
                    placeholder="e.g. October office rent"
                />
                <InputError message={errors.title} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                    <Label htmlFor="expense_category_id">Category</Label>
                    <NativeSelect
                        id="expense_category_id"
                        name="expense_category_id"
                        defaultValue={expense?.expense_category_id ?? ''}
                        required
                        placeholder="Select a category"
                        options={categories}
                    />
                    <InputError message={errors.expense_category_id} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="reference_number">Reference number</Label>
                    <Input
                        id="reference_number"
                        name="reference_number"
                        defaultValue={expense?.reference_number ?? ''}
                        maxLength={50}
                        placeholder="Leave blank to generate"
                    />
                    <InputError message={errors.reference_number} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        name="amount"
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0.01"
                        defaultValue={expense?.amount}
                        required
                        placeholder="0.00"
                    />
                    <InputError message={errors.amount} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="expense_date">Expense date</Label>
                    <Input
                        id="expense_date"
                        name="expense_date"
                        type="date"
                        defaultValue={expense?.expense_date ?? today()}
                        required
                    />
                    <InputError message={errors.expense_date} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="payment_method">Payment method</Label>
                    <NativeSelect
                        id="payment_method"
                        name="payment_method"
                        defaultValue={expense?.payment_method ?? ''}
                        placeholder="Not specified"
                        options={paymentMethods}
                    />
                    <InputError message={errors.payment_method} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="payment_status">Payment status</Label>
                    <NativeSelect
                        id="payment_status"
                        name="payment_status"
                        defaultValue={expense?.payment_status ?? 'paid'}
                        required
                        options={paymentStatuses}
                    />
                    <InputError message={errors.payment_status} />
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={expense?.description ?? ''}
                    maxLength={2000}
                    placeholder="Optional"
                />
                <InputError message={errors.description} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="attachment">
                    Receipt / supporting document
                </Label>
                {expense?.attachment_name && (
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                        <a
                            href={ExpenseController.attachment.url(expense.id)}
                            className="inline-flex items-center gap-1 underline underline-offset-4"
                        >
                            <Paperclip className="size-4" />
                            {expense.attachment_name}
                        </a>
                        <span className="flex items-center gap-2">
                            <Checkbox
                                id="remove_attachment"
                                name="remove_attachment"
                                value="1"
                            />
                            <Label htmlFor="remove_attachment">Remove</Label>
                        </span>
                    </div>
                )}
                <Input
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                />
                <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG or WEBP, up to 5 MB.
                    {expense?.attachment_name &&
                        ' Uploading a new file replaces the current one.'}
                </p>
                <InputError message={errors.attachment} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    defaultValue={expense?.notes ?? ''}
                    maxLength={2000}
                    placeholder="Optional"
                />
                <InputError message={errors.notes} />
            </div>
        </>
    );
}
