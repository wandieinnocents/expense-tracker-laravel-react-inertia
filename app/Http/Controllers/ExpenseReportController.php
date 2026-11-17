<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Models\ExpenseCategory;
use App\Services\ExpenseStatistics;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ExpenseReportController extends Controller
{
    /**
     * Expense summary and a filtered breakdown by status and category.
     */
    public function __invoke(Request $request, ExpenseStatistics $statistics): Response
    {
        $validated = $request->validate([
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'category' => ['nullable', 'integer'],
            'status' => ['nullable', Rule::enum(PaymentStatus::class)],
        ]);

        $filters = [
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'category' => $validated['category'] ?? null,
            'status' => $validated['status'] ?? null,
        ];

        return Inertia::render('expenses/reports', [
            'summary' => $statistics->summary(),
            'report' => $statistics->report([
                'date_from' => $filters['start_date'],
                'date_to' => $filters['end_date'],
                'category' => $filters['category'],
                'status' => $filters['status'],
            ]),
            'filters' => $filters,
            'categories' => ExpenseCategory::withTrashed()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (ExpenseCategory $category) => ['value' => $category->id, 'label' => $category->name])
                ->values()
                ->all(),
            'paymentStatuses' => PaymentStatus::options(),
        ]);
    }
}
