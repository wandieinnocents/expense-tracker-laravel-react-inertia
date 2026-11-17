import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';

export default function Users({ users }) {
    const { auth } = usePage().props;

    const deleteUser = (user) => {
        if (!confirm(`Delete ${user.name}? This cannot be undone.`)) {
            return;
        }

        router.delete(UserController.destroy.url(user.id), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading title="Users" description="Manage user accounts" />
                    <Button asChild>
                        <Link href={UserController.create()}>
                            <Plus /> New user
                        </Link>
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="px-4 py-3 font-medium">Email</th>
                                <th className="px-4 py-3 font-medium">
                                    Joined
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-t border-sidebar-border/70 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3">
                                            {user.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(
                                                user.created_at,
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={UserController.edit(
                                                            user.id,
                                                        )}
                                                    >
                                                        <Pencil /> Edit
                                                    </Link>
                                                </Button>
                                                {auth.user.id !== user.id && (
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() =>
                                                            deleteUser(user)
                                                        }
                                                    >
                                                        <Trash2 /> Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {users.last_page > 1 && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                            Page {users.current_page} of {users.last_page} ·{' '}
                            {users.total} users
                        </span>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!users.prev_page_url}
                                asChild={!!users.prev_page_url}
                            >
                                {users.prev_page_url ? (
                                    <Link
                                        href={users.prev_page_url}
                                        preserveScroll
                                    >
                                        Previous
                                    </Link>
                                ) : (
                                    'Previous'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!users.next_page_url}
                                asChild={!!users.next_page_url}
                            >
                                {users.next_page_url ? (
                                    <Link
                                        href={users.next_page_url}
                                        preserveScroll
                                    >
                                        Next
                                    </Link>
                                ) : (
                                    'Next'
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Users.layout = {
    breadcrumbs: [{ title: 'Users', href: UserController.index() }],
};
