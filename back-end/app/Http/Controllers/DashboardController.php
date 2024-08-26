<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get balance
        $balance = $user->transactions()
            ->selectRaw("SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) - SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_balance")
            ->whereMonth('date', Carbon::now()->month)
            ->value('total_balance');

        // Get recent transactions (last 5)
        $recentTransactions = $user->transactions()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'description' => $transaction->description,
                    'amount' => $transaction->amount,
                    'type' => $transaction->type,
                    'date' => $transaction->date,
                ];
            });

        // Get monthly stats for the current month
        $monthlyStats = collect([0])->map(function ($monthsAgo) use ($user) {
            $date = Carbon::now();
            $transactions = $user->transactions()
                ->whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->get();

            return [
                'year' => $date->year,
                'month' => $date->month,
                'income' => abs($transactions->where('type', 'income')->sum('amount')),
                'expense' => abs($transactions->where('type', 'expense')->sum('amount')),
            ];
        });

        return response()->json([
            'balance' => $balance ?? 0,
            'recent_transactions' => $recentTransactions->isEmpty() 
                ? [['id' => 0, 'description' => 'No transactions yet', 'amount' => 0, 'type' => 'none']] 
                : $recentTransactions,
            'monthly_stats' => $monthlyStats->isEmpty() 
                ? [['year' => Carbon::now()->year, 'month' => Carbon::now()->month, 'income' => 0, 'expense' => 0]]
                : $monthlyStats,
        ]);
    }
}