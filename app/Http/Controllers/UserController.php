<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * List users, newest first.
     */
    public function index(): Response
    {
        return Inertia::render('users/index', [
            'users' => User::query()
                ->select(['id', 'name', 'email', 'created_at'])
                ->latest()
                ->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a user.
     */
    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    /**
     * Store a newly created user.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created.')]);
        return to_route('users.index');
    }

    /**
     * Show the form for editing a user.
     */
    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'email']),
        ]);
    }

    /**
     * Update a user. A blank password leaves the current one unchanged.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        if (blank($data['password'] ?? null)) {
            unset($data['password']);
        }

        $user->update($data);
        Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);
        return to_route('users.index');
    }

    /**
     * Delete a user. Users cannot delete their own account from here.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($request->user()->is($user)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('You cannot delete your own account here.')]);
            return back();
        }

        $user->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('User deleted.')]);
        return to_route('users.index');
    }
}
