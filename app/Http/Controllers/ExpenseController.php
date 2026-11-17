<?php

namespace App\Http\Controllers;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Http\Requests\StoreExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExpenseController extends Controller
{
    /**
     * Attachments live on the private disk and are only served through
     * the authenticated attachment route.
     */
    private const DISK = 'local';

    private const DIRECTORY = 'expenses';

    /**
     * List expenses, newest first, with filters.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->value(),
            'category' => $request->input('category'),
            'status' => $request->input('status'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
            'trashed' => $request->input('trashed') === 'only' ? 'only' : null,
        ];

        return Inertia::render('expenses/index', [
            'expenses' => Expense::query()
                ->with(['category:id,name', 'creator:id,name'])
                ->filter($filters)
                ->latest('expense_date')
                ->latest('id')
                ->paginate(15)
                ->withQueryString(),
            'filters' => $filters,
            'categories' => $this->categoryOptions(),
            'paymentStatuses' => PaymentStatus::options(),
        ]);
    }

    /**
     * Show the form for recording an expense.
     */
    public function create(): Response
    {
        return Inertia::render('expenses/create', $this->formOptions());
    }

    /**
     * Store a newly recorded expense.
     */
    public function store(StoreExpenseRequest $request): RedirectResponse
    {
        $expense = new Expense($request->safe()->except('attachment'));
        $expense->created_by = $request->user()->id;

        if ($file = $request->file('attachment')) {
            $expense->attachment = $this->storeAttachment($file);
        }

        $expense->save();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense recorded.')]);

        return to_route('expenses.show', $expense);
    }

    /**
     * Show an expense's details.
     */
    public function show(Expense $expense): Response
    {
        $expense->load(['category:id,name', 'creator:id,name']);

        return Inertia::render('expenses/show', [
            'expense' => [
                ...$expense->toArray(),
                'payment_method_label' => $expense->payment_method?->label(),
                'payment_status_label' => $expense->payment_status->label(),
                'attachment_name' => $expense->attachment ? basename($expense->attachment) : null,
            ],
        ]);
    }

    /**
     * Show the form for editing an expense.
     */
    public function edit(Expense $expense): Response
    {
        return Inertia::render('expenses/edit', [
            ...$this->formOptions($expense),
            'expense' => [
                ...$expense->only([
                    'id', 'expense_category_id', 'title', 'reference_number', 'description',
                    'amount', 'payment_method', 'payment_status', 'notes', 'attachment',
                ]),
                'expense_date' => $expense->expense_date->toDateString(),
                'attachment_name' => $expense->attachment ? basename($expense->attachment) : null,
            ],
        ]);
    }

    /**
     * Update an expense, optionally replacing or removing its attachment.
     */
    public function update(UpdateExpenseRequest $request, Expense $expense): RedirectResponse
    {
        $expense->fill($request->safe()->except(['attachment', 'remove_attachment']));

        $file = $request->file('attachment');

        if ($file || $request->boolean('remove_attachment')) {
            $this->deleteAttachment($expense);
            $expense->attachment = $file ? $this->storeAttachment($file) : null;
        }

        $expense->save();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense updated.')]);

        return to_route('expenses.show', $expense);
    }

    /**
     * Soft delete an expense. The attachment is kept so a restore is complete.
     */
    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense deleted.')]);

        return to_route('expenses.index');
    }

    /**
     * Restore a soft-deleted expense.
     */
    public function restore(Expense $expense): RedirectResponse
    {
        $expense->restore();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Expense restored.')]);

        return to_route('expenses.show', $expense);
    }

    /**
     * Download an expense's receipt or supporting document.
     */
    public function attachment(Expense $expense): StreamedResponse
    {
        abort_unless($expense->attachment && Storage::disk(self::DISK)->exists($expense->attachment), 404);

        return Storage::disk(self::DISK)->download($expense->attachment);
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Expense $expense = null): array
    {
        return [
            'categories' => $this->categoryOptions($expense?->expense_category_id),
            'paymentMethods' => PaymentMethod::options(),
            'paymentStatuses' => PaymentStatus::options(),
        ];
    }

    /**
     * Active categories, plus the given one so an expense can keep a category
     * that has since been deactivated.
     *
     * @return array<int, array{value: int, label: string}>
     */
    private function categoryOptions(?int $includeId = null): array
    {
        return ExpenseCategory::query()
            ->where(fn ($query) => $query->active()->when($includeId, fn ($query) => $query->orWhere('id', $includeId)))
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn (ExpenseCategory $category) => ['value' => $category->id, 'label' => $category->name])
            ->values()
            ->all();
    }

    private function storeAttachment(UploadedFile $file): string
    {
        return $file->store(self::DIRECTORY, self::DISK) ?: abort(500, __('The attachment could not be saved.'));
    }

    private function deleteAttachment(Expense $expense): void
    {
        if ($expense->attachment) {
            Storage::disk(self::DISK)->delete($expense->attachment);
        }
    }
}
