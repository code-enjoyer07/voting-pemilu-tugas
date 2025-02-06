<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function index()
    {
        $data = User::all();
        return response()->json($data);
    }
    public function ban(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());
        }

        $data = User::find($id);

        $data->status = $request->status;

        $data->update();

        return response()->json([
            'message' => 'success'
        ]);
    }

    public function destroy($id)
    {
        $data = User::find($id);

        if (!$data) {
            return response()->json([
                'message' => 'user not found'
            ], 404);
        }
        $data->delete();
        return response()->json([
            'message' => 'success'
        ]);
    }
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|unique:users,username,' . $id,
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone_number' => 'nullable|string',
            'role' => 'sometimes|in:administrator,registered-users,public-users',
            'status' => 'sometimes|in:active,banned'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($request->only(['username', 'email', 'phone_number', 'role', 'status']));

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }
}
