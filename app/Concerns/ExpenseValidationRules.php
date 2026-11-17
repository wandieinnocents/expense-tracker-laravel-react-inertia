<?php

namespace App\Concerns;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;

trait ExpenseValidationRules
{
    /**
     * Get the validation rules used to validate expenses.
     *
     * New expenses must use an active category; an existing expense may keep
     * its current category even if it has since been deactivated.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function expenseRules(?Expense $expense = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'expense_category_id' => [
                'required',
                'integer',
                Rule::exists(ExpenseCategory::class, 'id')
                    ->whereNull('deleted_at')
                    ->where(function (Builder $query) use ($expense) {
                        $query->where('is_active', true);

                        if ($expense) {
                            $query->orWhere('id', $expense->expense_category_id);
                        }
                    }),
            ],
            'reference_number' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique(Expense::class, 'reference_number')->ignore($expense?->id),
            ],
            'description' => ['nullable', 'string', 'max:2000'],
            'amount' => ['required', 'numeric', 'gt:0', 'max:9999999999999.99', 'decimal:0,2'],
            'expense_date' => ['required', 'date'],
            'payment_method' => ['nullable', Rule::enum(PaymentMethod::class)],
            'payment_status' => ['required', Rule::enum(PaymentStatus::class)],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:5120'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'expense_category_id.exists' => __('Select an active expense category.'),
            'amount.gt' => __('The amount must be greater than zero.'),
            'attachment.mimes' => __('The attachment must be a PDF, JPG, PNG or WEBP file.'),
            'attachment.max' => __('The attachment may not be larger than 5 MB.'),
        ];
    }
}
