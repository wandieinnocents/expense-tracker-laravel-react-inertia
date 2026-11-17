import { Head, Link, router } from '@inertiajs/react';
import {
    ArchiveRestore,
    Pencil,
    Plus,
    Power,
    PowerOff,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ExpenseCategoryController from '@/actions/App/Http/Controllers/ExpenseCategoryController';
import Heading from '@/components/heading';
import Pagination from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ExpenseCategories({ categories, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const trashed = filters.trashed === 'only';

    const applyFilters = (next) => {
        router.get(
            ExpenseCategoryController.index.url(),
            {
                search: search || undefined,
                trashed: filters.trashed || undefined,
                ...next,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const toggleCategory = (category) => {
        router.patch(
            ExpenseCategoryController.toggle.url(category.id),
            {},
            { preserveScroll: true },
        );
    };

    const deleteCategory = (category) => {
        if (!confirm(`Delete the "${category.name}" category?`)) {
            return;
        }

        router.delete(ExpenseCategoryController.destroy.url(category.id), {
            preserveScroll: true,
        });
    };

    const restoreCategory = (category) => {
        router.patch(
            ExpenseCategoryController.restore.url(category.id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <>
            <Head title="Expense categories" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading
                        title="Expense categories"
                        description="Group expenses for reporting"
                    />
                    <Button asChild>
                        <Link href={ExpenseCategoryController.create()}>
                            <Plus /> New category
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <form
                        className="relative w-full sm:w-72"
                        onSubmit={(e) => {
                            e.preventDefault();
                            applyFilters({ search: search || undefined });
                        }}
                    >
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search categories"
                            className="pl-9"
                        />
                    </form>
                    <div className="flex gap-1">
                        <Button
                            variant={trashed ? 'ghost' : 'secondary'}
                            size="sm"
                            onClick={() => applyFilters({ trashed: undefined })}
                        >
                            Active
                        </Button>
                        <Button
                            variant={trashed ? 'secondary' : 'ghost'}
                            size="sm"
                            onClick={() => applyFilters({ trashed: 'only' })}
                        >
                            Deleted
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Name</th>
                                <th className="hidden px-4 py-3 font-medium md:table-cell">
                                    Description
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Expenses
                                </th>
                                <th className="px-4 py-3 text-right font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-6 text-center text-muted-foreground"
                                    >
                                        No categories found.
                                    </td>
                                </tr>
                            ) : (
                                categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-t border-sidebar-border/70 dark:border-sidebar-border"
                                    >
                                        <td className="px-4 py-3 font-medium">
                                            {category.name}
                                        </td>
                                        <td className="hidden max-w-sm truncate px-4 py-3 text-muted-foreground md:table-cell">
                                            {category.description || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            {category.deleted_at ? (
                                                <Badge variant="destructive">
                                                    Deleted
                                                </Badge>
                                            ) : category.is_active ? (
                                                <Badge variant="secondary">
                                                    Active
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Inactive
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right tabular-nums">
                                            {category.expenses_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {category.deleted_at ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            restoreCategory(
                                                                category,
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
                                                                href={ExpenseCategoryController.edit(
                                                                    category.id,
                                                                )}
                                                            >
                                                                <Pencil /> Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                toggleCategory(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            {category.is_active ? (
                                                                <>
                                                                    <PowerOff />{' '}
                                                                    Deactivate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Power />{' '}
                                                                    Activate
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            disabled={
                                                                category.expenses_count >
                                                                0
                                                            }
                                                            title={
                                                                category.expenses_count >
                                                                0
                                                                    ? 'Categories with expenses cannot be deleted. Deactivate it instead.'
                                                                    : undefined
                                                            }
                                                            onClick={() =>
                                                                deleteCategory(
                                                                    category,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 /> Delete
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

                <Pagination paginator={categories} label="categories" />
            </div>
        </>
    );
}

ExpenseCategories.layout = {
    breadcrumbs: [
        {
            title: 'Expense categories',
            href: ExpenseCategoryController.index(),
        },
    ],
};
