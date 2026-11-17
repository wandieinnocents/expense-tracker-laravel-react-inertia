const moneyFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatMoney(value) {
    return moneyFormatter.format(Number(value ?? 0));
}

/**
 * Format a Y-m-d date string without shifting it across time zones.
 */
export function formatDate(value) {
    if (!value) {
        return '—';
    }

    const [year, month, day] = String(value)
        .slice(0, 10)
        .split('-')
        .map(Number);

    return new Date(year, month - 1, day).toLocaleDateString();
}

export const paymentStatusLabels = {
    paid: 'Paid',
    unpaid: 'Unpaid',
    partial: 'Partial',
};

export const paymentStatusClasses = {
    paid: 'border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    unpaid: 'border-transparent bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
    partial:
        'border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
};
