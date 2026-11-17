<?php

namespace App\Http\Controllers;

use App\Services\ExpenseStatistics;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Show the dashboard with headline expense figures.
     */
    public function __invoke(ExpenseStatistics $statistics): Response
    {
        return Inertia::render('dashboard', [
            'summary' => $statistics->summary(),
        ]);
    }
}
