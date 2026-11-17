import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import UserFormFields from '@/components/user-form-fields';
import { Button } from '@/components/ui/button';

export default function EditUser({ user }) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Edit user"
                    description={`Update ${user.name}'s details`}
                />

                <Form
                    {...UserController.update.form(user.id)}
                    resetOnError={['password', 'password_confirmation']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <UserFormFields
                                errors={errors}
                                user={user}
                                passwordOptional
                            />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Button variant="outline" asChild>
                                    <Link href={UserController.index()}>
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

EditUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: UserController.index() },
        { title: 'Edit', href: UserController.index() },
    ],
};
