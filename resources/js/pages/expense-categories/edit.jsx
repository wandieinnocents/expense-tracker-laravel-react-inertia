import { Form, Head, Link } from '@inertiajs/react';
import ExpenseCategoryController from '@/actions/App/Http/Controllers/ExpenseCategoryController';
import ExpenseCategoryFormFields from '@/components/expense-category-form-fields';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function EditExpenseCategory({ category }) {
    return (
        <>
            <Head title={`Edit ${category.name}`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Edit expense category"
                    description={`Update the "${category.name}" category`}
                />

                <Form
                    {...ExpenseCategoryController.update.form(category.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <ExpenseCategoryFormFields
                                errors={errors}
                                category={category}
                            />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
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

EditExpenseCategory.layout = {
    breadcrumbs: [
        {
            title: 'Expense categories',
            href: ExpenseCategoryController.index(),
        },
        { title: 'Edit', href: ExpenseCategoryController.index() },
    ],
};
