<?php

namespace Database\Seeders;

use App\Models\ExpenseCategory;
use Illuminate\Database\Seeder;

class ExpenseCategorySeeder extends Seeder
{
    /**
     * Default expense categories.
     *
     * @var list<string>
     */
    private const CATEGORIES = [
        'Rent',
        'Salaries & Wages',
        'Transport',
        'Utilities',
        'Internet & Communication',
        'Fuel',
        'Marketing & Advertising',
        'Repairs & Maintenance',
        'Office Supplies',
        'Taxes & Licenses',
        'Bank Charges',
        'Insurance',
        'Security',
        'Other Expenses',
    ];

    /**
     * Seed the default categories. Existing categories (including deleted
     * ones) are left untouched, so this is safe to run repeatedly.
     */
    public function run(): void
    {
        foreach (self::CATEGORIES as $name) {
            ExpenseCategory::withTrashed()->firstOrCreate(
                ['name' => $name],
                ['is_active' => true],
            );
        }
    }
}
