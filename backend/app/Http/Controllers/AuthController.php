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
}
