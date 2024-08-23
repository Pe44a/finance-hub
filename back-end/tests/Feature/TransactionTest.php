<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Hash;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    protected function createUser($attributes = [])
    {
        return User::create(array_merge([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => Hash::make('password'),
        ], $attributes));
    }

    protected function createTransaction($user, $attributes = [])
    {
        return Transaction::create(array_merge([
            'user_id' => $user->id,
            'amount' => 100,
            'description' => 'Test transaction',
            'date' => '2023-08-24',
            'type' => 'income',
        ], $attributes));
    }

    public function test_user_can_create_transaction()
    {
        $user = $this->createUser();
        $transactionData = [
            'amount' => 100,
            'description' => 'Test transaction',
            'date' => '2023-08-24',
            'type' => 'income',
        ];

        $response = $this->actingAs($user)
            ->postJson('/api/transactions', $transactionData);

        $response->assertStatus(201)
            ->assertJsonFragment($transactionData);

        $this->assertDatabaseHas('transactions', $transactionData);
    }

    public function test_user_can_view_own_transactions()
    {
        $user = $this->createUser();
        for ($i = 0; $i < 5; $i++) {
            $this->createTransaction($user);
        }

        $response = $this->actingAs($user)
            ->getJson('/api/transactions');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_user_cannot_view_others_transactions()
    {
        $user1 = $this->createUser(['email' => 'user1@example.com']);
        $user2 = $this->createUser(['email' => 'user2@example.com']);
        $transaction = $this->createTransaction($user2);

        $response = $this->actingAs($user1)
            ->getJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(404);
    }

    public function test_user_can_update_own_transaction()
    {
        $user = $this->createUser();
        $transaction = $this->createTransaction($user);
        $updatedData = ['amount' => 200, 'description' => 'Updated transaction'];

        $response = $this->actingAs($user)
            ->putJson("/api/transactions/{$transaction->id}", $updatedData);

        $response->assertStatus(200)
            ->assertJsonFragment($updatedData);

        $this->assertDatabaseHas('transactions', $updatedData);
    }

    public function test_user_cannot_update_others_transaction()
    {
        $user1 = $this->createUser(['email' => 'user1@example.com']);
        $user2 = $this->createUser(['email' => 'user2@example.com']);
        $transaction = $this->createTransaction($user2);
        $updatedData = ['amount' => 200, 'description' => 'Updated transaction'];

        $response = $this->actingAs($user1)
            ->putJson("/api/transactions/{$transaction->id}", $updatedData);

        $response->assertStatus(404);
        $this->assertDatabaseMissing('transactions', $updatedData);
    }

    public function test_user_can_delete_own_transaction()
    {
        $user = $this->createUser();
        $transaction = $this->createTransaction($user);

        $response = $this->actingAs($user)
            ->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    }

    public function test_user_cannot_delete_others_transaction()
    {
        $user1 = $this->createUser(['email' => 'user1@example.com']);
        $user2 = $this->createUser(['email' => 'user2@example.com']);
        $transaction = $this->createTransaction($user2);

        $response = $this->actingAs($user1)
            ->deleteJson("/api/transactions/{$transaction->id}");

        $response->assertStatus(404);
        $this->assertDatabaseHas('transactions', ['id' => $transaction->id]);
    }

    public function test_unauthenticated_user_cannot_access_transactions()
    {
        $response = $this->getJson('/api/transactions');
        $response->assertStatus(401);
    }
}