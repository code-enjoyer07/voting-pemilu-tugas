<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|min:8|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = new User();
        $user->username = $request->username;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);

        $user->save();


        return response()->json([
            'message' => 'success'
        ]);
    }
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            $user = User::where('email', $request['email'])->first();

            $errorMessage = $user ? 'Password Salah' : 'Username tidak terdaftar';

            return response()->json(['message' => $errorMessage], 401);
        }

        $user = Auth::user();
        if(auth()->user()->status == 'banned') {
            return response()->json([
                'message' => 'account ada telah di banned'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['accessToken' => $token, "user" => $user]);
    }
}
