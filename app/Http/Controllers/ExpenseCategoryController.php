<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExpenseCategoryRequest;
use App\Http\Requests\UpdateExpenseCategoryRequest;
use App\Models\ExpenseCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseCategoryController extends Controller
{
    /**
     * List expense categories with their expense counts.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->value(),
            'trashed' => $request->input('trashed') === 'only' ? 'only' : null,
        ];

        return Inertia::render('expense-categories/index', [
            'categories' => ExpenseCategory::query()
                ->withCount('expenses')
                ->when($filters['trashed'], fn ($query) => $query->onlyTrashed())
                ->when($filters['search'], fn ($query, $search) => $query->where('name', 'like', "%{$search}%"))
                ->orderBy('name')
                ->paginate(15)
                ->withQueryString(),
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating an expense category.
     */
    public function create(): Response
    {
        return Inertia::render('expense-categories/create');
    }

    /**
     * Store a newly created expense category.
     */
    public function store(StoreExpenseCategoryRequest $request): RedirectResponse
    {
        ExpenseCategory::create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense category created.')]);

        return to_route('expense-categories.index');
    }

    /**
     * Show the form for editing an expense category.
     */
    public function edit(ExpenseCategory $expenseCategory): Response
    {
        return Inertia::render('expense-categories/edit', [
            'category' => $expenseCategory->only(['id', 'name', 'description', 'is_active']),
        ]);
    }

    /**
     * Update an expense category.
     */
    public function update(UpdateExpenseCategoryRequest $request, ExpenseCategory $expenseCategory): RedirectResponse
    {
        $expenseCategory->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense category updated.')]);

        return to_route('expense-categories.index');
    }

    /**
     * Activate or deactivate an expense category.
     */
    public function toggle(ExpenseCategory $expenseCategory): RedirectResponse
    {
        $expenseCategory->update(['is_active' => ! $expenseCategory->is_active]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $expenseCategory->is_active ? __('Category activated.') : __('Category deactivated.'),
        ]);

        return back();
    }

    /**
     * Soft delete an expense category. Categories with expenses (including
     * deleted ones that could be restored) cannot be deleted.
     */
    public function destroy(ExpenseCategory $expenseCategory): RedirectResponse
    {
        if ($expenseCategory->expenses()->withTrashed()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => __('This category has expenses and cannot be deleted. Deactivate it instead.'),
            ]);

            return back();
        }

        $expenseCategory->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense category deleted.')]);

        return to_route('expense-categories.index');
    }

    /**
     * Restore a soft-deleted expense category.
     */
    public function restore(ExpenseCategory $expenseCategory): RedirectResponse
    {
        $expenseCategory->restore();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense category restored.')]);

        return to_route('expense-categories.index');
    }
}
