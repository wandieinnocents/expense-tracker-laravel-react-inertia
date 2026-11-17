<?php

namespace App\Http\Requests;

use App\Concerns\ExpenseValidationRules;
use App\Models\Expense;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseRequest extends FormRequest
{
    use ExpenseValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $expense = $this->route('expense');

        return [
            ...$this->expenseRules($expense instanceof Expense ? $expense : null),
            'remove_attachment' => ['boolean'],
        ];
    }
}
