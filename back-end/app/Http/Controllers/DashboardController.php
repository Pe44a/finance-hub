<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $balance = $user->transactions()
            ->select(DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE -amount END) as balance'))
            ->value('balance');

        $recentTransactions = $user->transactions()
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        $monthlyStats = $user->transactions()
            ->select(
                DB::raw('YEAR(date) as year'),
                DB::raw('MONTH(date) as month'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as expense')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->take(6)
            ->get();

        return response()->json([
            'balance' => $balance,
            'recent_transactions' => $recentTransactions,
            'monthly_stats' => $monthlyStats,
        ]);
    }
}