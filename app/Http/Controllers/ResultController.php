<?php

namespace App\Http\Controllers;

use App\Models\Results;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ResultController extends Controller
{
    public function index()
    {
        $results = Results::with(['province', 'city', 'users'])
            ->where('user_id', Auth::id())
            ->get();

        if ($results->isEmpty()) {
            return response()->json([
                'status' => 404
            ]);
        }

        return response()->json($results);
    }

    public function all()
    {
        $result = Results::all();

        return response()->json($result);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|string|max:255',
            'presiden' => 'required|string|max:255',
            'wakil_presiden' => 'required|string|max:255',
            'province_id' => 'required|exists:provinces,id',
            'city_id' => 'required|exists:citys,id',
        ]);

        $result = Results::create([
            'number' => $validated['number'],
            'presiden' => $validated['presiden'],
            'wakil_presiden' => $validated['wakil_presiden'],
            'province_id' => $validated['province_id'],
            'city_id' => $validated['city_id'],
            'user_id' => Auth::id()
        ]);

        return response()->json([
            'message' => 'Hasil Pemilu berhasil ditambahkan.',
            'data' => $result
        ], 201);
    }

    public function satu()
    {
        $result = Results::where('number', '01')->get();
        return response()->json($result);
    }
    public function dua()
    {
        $result = Results::where('number', '02')->get();
        return response()->json($result);
    }
    public function tiga()
    {
        $result = Results::where('number', '03')->get();
        return response()->json($result);
    }
}