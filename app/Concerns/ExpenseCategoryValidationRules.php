<?php

namespace App\Concerns;

use App\Models\ExpenseCategory;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

trait ExpenseCategoryValidationRules
{
    /**
     * Get the validation rules used to validate expense categories.
     *
     * Names are unique case-insensitively across all categories, including
     * deleted ones, so a deleted category is restored rather than duplicated.
     *
     * @return array<string, array<int, Closure|ValidationRule|array<mixed>|string>>
     */
    protected function expenseCategoryRules(?int $categoryId = null): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, Closure $fail) use ($categoryId) {
                    $duplicate = ExpenseCategory::withTrashed()
                        ->whereRaw('LOWER(name) = ?', [mb_strtolower((string) $value)])
                        ->when($categoryId, fn ($query) => $query->whereKeyNot($categoryId))
                        ->first();

                    if ($duplicate) {
                        $fail($duplicate->trashed()
                            ? __('A deleted category with this name exists. Restore it instead.')
                            : __('A category with this name already exists.'));
                    }
                },
            ],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $name = $this->input('name');

        $this->merge([
            'name' => is_string($name) ? preg_replace('/\s+/', ' ', trim($name)) : $name,
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
