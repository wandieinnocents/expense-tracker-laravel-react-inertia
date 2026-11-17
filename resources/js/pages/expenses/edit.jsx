import { Form, Head, Link } from '@inertiajs/react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import ExpenseFormFields from '@/components/expense-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function EditExpense({
    expense,
    categories,
    paymentMethods,
    paymentStatuses,
}) {
    return (
        <>
            <Head title={`Edit ${expense.title}`} />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title="Edit expense"
                    description={expense.reference_number}
                />

                <Form
                    {...ExpenseController.update.form(expense.id)}
                    resetOnError={['attachment']}
                    className="space-y-6"
                >
                    {({ processing, errors, progress }) => (
                        <>
                            <ExpenseFormFields
                                errors={errors}
                                expense={expense}
                                categories={categories}
                                paymentMethods={paymentMethods}
                                paymentStatuses={paymentStatuses}
                            />

                            {progress && (
                                <progress
                                    value={progress.percentage}
                                    max="100"
                                    className="w-full"
                                />
                            )}

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={ExpenseController.show(
                                            expense.id,
                                        )}
                                    >
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

EditExpense.layout = {
    breadcrumbs: [
        { title: 'Expenses', href: ExpenseController.index() },
        { title: 'Edit', href: ExpenseController.index() },
    ],
};
