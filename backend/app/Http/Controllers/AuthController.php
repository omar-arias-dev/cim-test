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
        Log::info($request);

        $request->validate([
            'email' => 'required|email',
            'current_password' => 'required',
            'new_password' => 'required|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 401);
        }

        $user->update([
            'password' => Hash::make($request->new_password)
        ]);

        Log::info("User {$user->email} has changed their password.");

        return response()->json([
            'message' => 'Password changed successfully',
        ], 200);
    }

}
