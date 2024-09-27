<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\LoginLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        Log::info($request);
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user && Hash::check($request->password, $user->password)) {
            $user->update([
                'is_logged' => true
            ]);
            $tokenRequest = Http::post("http://104.154.142.250/apis/exam/auth", [
                'user' => 'csm',
                'password' => 'exam1csm',
            ]);
            $token = $tokenRequest->json();
            LoginLog::create([
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);
            return response()->json([
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ]
            ], 200);
        }
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $user->update([
                'is_logged' => true,
                'token' => null,
            ]);
            return response()->json([
                'message' => 'Logout successful',
                'data' => [
                    'user' => $user,
                ]
            ], 200);
        }
        return response()->json(['message' => 'User not found'], 404);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'current_password' => 'required',
            'new_password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found', 'code' => 404], 404);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect', 'code' => 401], 401);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Password changed successfully',
            'code' => 200,
        ], 200);
    }

    public function getAllUsers() {
        $users = User::all();
        if (!$users) {
            return response()->json(['message' => 'Users not found', 'code' => 404], 404);
        }
        return response()->json([
            'users' => $users,
            'code' => 200,
        ], 200);
    }

    public function deleteUser(Request $request)
    {
        $request->validate([
            'id' => 'required',
        ]);

        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'User not found', 'code' => 404], 404);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
            'code' => 200,
        ], 200);
    }

    public function updateUser(Request $request) {
        $user = User::find($request->id);

        if (!$user) {
            return response()->json(['message' => 'User not found', 'code' => 404], 404);
        }

        $user->update([
            'email' => $request->email,
            'name' => $request->name,
            'role' => $request->role ?? 'AGENT',
        ]);

        return response()->json([
            'message' => 'User updated successfully',
            'code' => 200,
            'user' => $user,
        ], 200);
    }


public function createUser(Request $request) {
    $user = User::create([
        'email' => $request->email,
        'name' => $request->name,
        'password' => Hash::make($request->password),
        'role' => $request->role ?? 'AGENT',
        'is_logged' => false,
        'token' => null,
    ]);

    return response()->json([
        'message' => 'User created successfully',
        'code' => 201,
        'user' => $user,
    ], 201);
}

}
