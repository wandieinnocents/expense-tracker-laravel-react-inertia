<?php

namespace App\Http\Requests;

use App\Concerns\ExpenseCategoryValidationRules;
use App\Models\ExpenseCategory;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateExpenseCategoryRequest extends FormRequest
{
    use ExpenseCategoryValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $category = $this->route('expense_category');

        return $this->expenseCategoryRules($category instanceof ExpenseCategory ? $category->id : null);
    }
}
