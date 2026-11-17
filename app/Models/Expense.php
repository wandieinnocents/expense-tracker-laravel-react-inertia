<?php

namespace App\Models;

use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $expense_category_id
 * @property int|null $created_by
 * @property string $title
 * @property string|null $reference_number
 * @property string|null $description
 * @property string $amount
 * @property Carbon $expense_date
 * @property PaymentMethod|null $payment_method
 * @property PaymentStatus $payment_status
 * @property string|null $attachment
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'expense_category_id',
    'title',
    'reference_number',
    'description',
    'amount',
    'expense_date',
    'payment_method',
    'payment_status',
    'notes',
])]
class Expense extends Model
{
    use SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'expense_date' => 'date:Y-m-d',
            'payment_method' => PaymentMethod::class,
            'payment_status' => PaymentStatus::class,
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Expense $expense) {
            if (blank($expense->reference_number)) {
                $expense->reference_number = static::generateReferenceNumber();
            }
        });
    }

    /**
     * Generate a unique reference such as EXP-20261117-4KQ9ZT.
     */
    public static function generateReferenceNumber(): string
    {
        do {
            $reference = 'EXP-'.now()->format('Ymd').'-'.Str::upper(Str::random(6));
        } while (static::withTrashed()->where('reference_number', $reference)->exists());

        return $reference;
    }

    /**
     * @return BelongsTo<ExpenseCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(ExpenseCategory::class, 'expense_category_id')->withTrashed();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Apply listing / report filters.
     *
     * @param  Builder<Expense>  $query
     * @param  array<string, mixed>  $filters
     */
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, function (Builder $query, $search) {
                $query->where(function (Builder $query) use ($search) {
                    $query->where('title', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%");
                });
            })
            ->when($filters['category'] ?? null, fn (Builder $query, $category) => $query->where('expense_category_id', $category))
            ->when($filters['status'] ?? null, fn (Builder $query, $status) => $query->where('payment_status', $status))
            ->when($filters['date_from'] ?? null, fn (Builder $query, $from) => $query->whereDate('expense_date', '>=', $from))
            ->when($filters['date_to'] ?? null, fn (Builder $query, $to) => $query->whereDate('expense_date', '<=', $to))
            ->when(($filters['trashed'] ?? null) === 'only', fn (Builder $query) => $query->onlyTrashed());
    }
}
