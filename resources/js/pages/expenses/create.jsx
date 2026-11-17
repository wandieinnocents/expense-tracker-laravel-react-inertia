import { Form, Head, Link } from '@inertiajs/react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import ExpenseFormFields from '@/components/expense-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function CreateExpense({
    categories,
    paymentMethods,
    paymentStatuses,
}) {
    return (
        <>
            <Head title="Record expense" />

            <div className="max-w-2xl space-y-6 p-4">
                <Heading
                    title="Record expense"
                    description="Add a new business expense"
                />

                <Form
                    {...ExpenseController.store.form()}
                    resetOnError={['attachment']}
                    className="space-y-6"
                >
                    {({ processing, errors, progress }) => (
                        <>
                            <ExpenseFormFields
                                errors={errors}
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
                                <Button disabled={processing}>
                                    Save expense
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href={ExpenseController.index()}>
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

CreateExpense.layout = {
    breadcrumbs: [
        { title: 'Expenses', href: ExpenseController.index() },
        { title: 'Record', href: ExpenseController.create() },
    ],
};
