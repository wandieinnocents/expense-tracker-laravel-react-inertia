<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExpenseCategoryController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ExpenseReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::resource('users', UserController::class)->except('show');

    Route::patch('expense-categories/{expense_category}/toggle', [ExpenseCategoryController::class, 'toggle'])
        ->name('expense-categories.toggle');
    Route::patch('expense-categories/{expense_category}/restore', [ExpenseCategoryController::class, 'restore'])
        ->withTrashed()
        ->name('expense-categories.restore');
    Route::resource('expense-categories', ExpenseCategoryController::class)->except('show');

    Route::get('expenses/reports', ExpenseReportController::class)->name('expenses.reports');
    Route::patch('expenses/{expense}/restore', [ExpenseController::class, 'restore'])
        ->withTrashed()
        ->name('expenses.restore');
    Route::get('expenses/{expense}/attachment', [ExpenseController::class, 'attachment'])
        ->name('expenses.attachment');
    Route::resource('expenses', ExpenseController::class);
});

require __DIR__.'/settings.php';
