import { Form, Head, Link } from '@inertiajs/react';
import ExpenseCategoryController from '@/actions/App/Http/Controllers/ExpenseCategoryController';
import ExpenseCategoryFormFields from '@/components/expense-category-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function CreateExpenseCategory() {
    return (
        <>
            <Head title="Create expense category" />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Create expense category"
                    description="Add a new category for grouping expenses"
                />

                <Form
                    {...ExpenseCategoryController.store.form()}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <ExpenseCategoryFormFields errors={errors} />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Create</Button>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={ExpenseCategoryController.index()}
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

CreateExpenseCategory.layout = {
    breadcrumbs: [
        {
            title: 'Expense categories',
            href: ExpenseCategoryController.index(),
        },
        { title: 'Create', href: ExpenseCategoryController.create() },
    ],
};
