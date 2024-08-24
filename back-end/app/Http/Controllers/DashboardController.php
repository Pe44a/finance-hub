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
        $balance = $user->transactions()->sum('amount');

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
                    'type' => $transaction->amount > 0 ? 'income' : 'expense',
                ];
            });

        // Get monthly stats for the last 3 months
        $monthlyStats = collect(range(0, 2))->map(function ($monthsAgo) use ($user) {
            $date = Carbon::now()->subMonths($monthsAgo);
            $transactions = $user->transactions()
                ->whereYear('date', $date->year)
                ->whereMonth('date', $date->month)
                ->get();

            return [
                'year' => $date->year,
                'month' => $date->month,
                'income' => $transactions->where('amount', '>', 0)->sum('amount'),
                'expense' => abs($transactions->where('amount', '<', 0)->sum('amount')),
            ];
        });

        return response()->json([
            'balance' => $balance ?? 0,
            'recent_transactions' => $recentTransactions->isEmpty() 
                ? [['id' => 0, 'description' => 'No transactions yet', 'amount' => 0, 'type' => 'none']] 
                : $recentTransactions,
            'monthly_stats' => $monthlyStats->isEmpty() 
                ? [
                    ['year' => Carbon::now()->year, 'month' => Carbon::now()->month, 'income' => 0, 'expense' => 0],
                    ['year' => Carbon::now()->subMonth()->year, 'month' => Carbon::now()->subMonth()->month, 'income' => 0, 'expense' => 0],
                    ['year' => Carbon::now()->subMonths(2)->year, 'month' => Carbon::now()->subMonths(2)->month, 'income' => 0, 'expense' => 0],
                ] 
                : $monthlyStats,
        ]);
    }
}