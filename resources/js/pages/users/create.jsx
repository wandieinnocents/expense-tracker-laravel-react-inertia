import { Form, Head, Link } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import UserFormFields from '@/components/user-form-fields';
import { Button } from '@/components/ui/button';

export default function CreateUser() {
    return (
        <>
            <Head title="Create user record" />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="Create user"
                    description="Add a new user account"
                />

                <Form
                    {...UserController.store.form()}
                    resetOnError={['password', 'password_confirmation']}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <UserFormFields errors={errors} />

                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Create</Button>
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

CreateUser.layout = {
    breadcrumbs: [
        { title: 'Users', href: UserController.index() },
        { title: 'Create', href: UserController.create() },
    ],
};
