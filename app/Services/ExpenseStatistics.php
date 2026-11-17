<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\Expense;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class ExpenseStatistics
{
    /**
     * Headline figures across all (non-deleted) expenses.
     *
     * @return array<string, array{amount: float, count: int}>
     */
    public function summary(): array
    {
        return [
            'total' => $this->aggregate(Expense::query()),
            'this_month' => $this->aggregate(Expense::query()->whereBetween('expense_date', [
                now()->startOfMonth()->toDateString(),
                now()->endOfMonth()->toDateString(),
            ])),
            'this_year' => $this->aggregate(Expense::query()->whereBetween('expense_date', [
                now()->startOfYear()->toDateString(),
                now()->endOfYear()->toDateString(),
            ])),
            ...$this->byStatus(Expense::query()),
        ];
    }

    /**
     * Totals for a filtered set of expenses.
     *
     * @param  array<string, mixed>  $filters
     * @return array{total: array{amount: float, count: int}, paid: array{amount: float, count: int}, unpaid: array{amount: float, count: int}, partial: array{amount: float, count: int}, by_category: array<int, array{id: int, name: string, amount: float, count: int}>}
     */
    public function report(array $filters): array
    {
        $query = fn () => Expense::query()->filter($filters);

        return [
            'total' => $this->aggregate($query()),
            ...$this->byStatus($query()),
            'by_category' => $this->byCategory($query()),
        ];
    }

    /**
     * @param  Builder<Expense>  $query
     * @return array{amount: float, count: int}
     */
    private function aggregate(Builder $query): array
    {
        $row = $query->toBase()
            ->selectRaw('COALESCE(SUM(amount), 0) as amount, COUNT(*) as count')
            ->first();

        return [
            'amount' => round((float) ($row->amount ?? 0), 2),
            'count' => (int) ($row->count ?? 0),
        ];
    }

    /**
     * @param  Builder<Expense>  $query
     * @return array{paid: array{amount: float, count: int}, unpaid: array{amount: float, count: int}, partial: array{amount: float, count: int}}
     */
    private function byStatus(Builder $query): array
    {
        $rows = $query->toBase()
            ->select('payment_status')
            ->selectRaw('COALESCE(SUM(amount), 0) as amount, COUNT(*) as count')
            ->groupBy('payment_status')
            ->get()
            ->keyBy('payment_status');

        $totals = function (PaymentStatus $status) use ($rows): array {
            $row = $rows->get($status->value);

            return [
                'amount' => round((float) ($row->amount ?? 0), 2),
                'count' => (int) ($row->count ?? 0),
            ];
        };

        return [
            PaymentStatus::Paid->value => $totals(PaymentStatus::Paid),
            PaymentStatus::Unpaid->value => $totals(PaymentStatus::Unpaid),
            PaymentStatus::Partial->value => $totals(PaymentStatus::Partial),
        ];
    }

    /**
     * @param  Builder<Expense>  $query
     * @return array<int, array{id: int, name: string, amount: float, count: int}>
     */
    private function byCategory(Builder $query): array
    {
        return $query->toBase()
            ->join('expense_categories', 'expense_categories.id', '=', 'expenses.expense_category_id')
            ->select('expense_categories.id', 'expense_categories.name')
            ->selectRaw('COALESCE(SUM(expenses.amount), 0) as amount, COUNT(*) as count')
            ->groupBy('expense_categories.id', 'expense_categories.name')
            ->orderByDesc(DB::raw('SUM(expenses.amount)'))
            ->get()
            ->map(fn ($row) => [
                'id' => (int) $row->id,
                'name' => (string) $row->name,
                'amount' => round((float) $row->amount, 2),
                'count' => (int) $row->count,
            ])
            ->values()
            ->all();
    }
}
