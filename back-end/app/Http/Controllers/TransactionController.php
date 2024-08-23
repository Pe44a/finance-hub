<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactions = $request->user()->transactions()
            ->orderBy('date', 'desc')
            ->paginate(15);
        return response()->json($transactions);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'amount' => 'required|numeric',
            'description' => 'required|string|max:255',
            'date' => 'required|date',
            'type' => 'required|in:income,expense',
        ]);

        $transaction = $request->user()->transactions()->create($validatedData);
        return response()->json($transaction, 201);
    }

    public function show(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        return response()->json($transaction);
    }

    public function update(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);

        $validatedData = $request->validate([
            'amount' => 'numeric',
            'description' => 'string|max:255',
            'date' => 'date',
            'type' => 'in:income,expense',
        ]);

        $transaction->update($validatedData);
        return response()->json($transaction);
    }

    public function destroy(Request $request, $id)
    {
        $transaction = $request->user()->transactions()->findOrFail($id);
        $transaction->delete();
        return response()->json(null, 204);
    }
}