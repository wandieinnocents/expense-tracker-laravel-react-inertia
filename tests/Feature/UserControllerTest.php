<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $this->get(route('users.index'))->assertRedirect(route('login'));
    }

    public function test_index_lists_users_paginated(): void
    {
        $admin = User::factory()->create();
        User::factory()->count(12)->create();

        $this->actingAs($admin)
            ->get(route('users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/index')
                ->has('users.data', 10)
                ->where('users.total', 13)
                ->missing('users.data.0.password'));
    }

    public function test_create_page_renders(): void
    {
        $this->actingAs(User::factory()->create())
            ->get(route('users.create'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('users/create'));
    }

    public function test_a_user_can_be_created(): void
    {
        $this->actingAs(User::factory()->create())
            ->post(route('users.store'), [
                'name' => 'Jane Doe',
                'email' => 'jane@example.com',
                'password' => 'password',
                'password_confirmation' => 'password',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.index'));

        $user = User::where('email', 'jane@example.com')->firstOrFail();
        $this->assertSame('Jane Doe', $user->name);
        $this->assertTrue(Hash::check('password', $user->password));
    }

    public function test_store_validates_input(): void
    {
        $existing = User::factory()->create();

        $this->actingAs($existing)
            ->post(route('users.store'), [
                'name' => '',
                'email' => $existing->email,
                'password' => 'password',
                'password_confirmation' => 'different',
            ])
            ->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_edit_page_renders_without_sensitive_fields(): void
    {
        $user = User::factory()->create();

        $this->actingAs(User::factory()->create())
            ->get(route('users.edit', $user))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/edit')
                ->where('user.id', $user->id)
                ->missing('user.password'));
    }

    public function test_a_user_can_be_updated_without_changing_password(): void
    {
        $user = User::factory()->create();
        $originalHash = $user->password;

        $this->actingAs(User::factory()->create())
            ->put(route('users.update', $user), [
                'name' => 'Updated Name',
                'email' => $user->email,
                'password' => '',
                'password_confirmation' => '',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.index'));

        $user->refresh();
        $this->assertSame('Updated Name', $user->name);
        $this->assertSame($originalHash, $user->password);
    }

    public function test_a_users_password_can_be_changed(): void
    {
        $user = User::factory()->create();

        $this->actingAs(User::factory()->create())
            ->put(route('users.update', $user), [
                'name' => $user->name,
                'email' => $user->email,
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ])
            ->assertSessionHasNoErrors();

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_a_user_can_keep_their_own_email_on_update(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->put(route('users.update', $user), [
                'name' => $user->name,
                'email' => $user->email,
            ])
            ->assertSessionHasNoErrors();
    }

    public function test_a_user_can_be_deleted(): void
    {
        $user = User::factory()->create();

        $this->actingAs(User::factory()->create())
            ->delete(route('users.destroy', $user))
            ->assertRedirect(route('users.index'));

        $this->assertModelMissing($user);
    }

    public function test_users_cannot_delete_themselves(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('users.index'))
            ->delete(route('users.destroy', $user))
            ->assertRedirect(route('users.index'));

        $this->assertModelExists($user);
    }
}
