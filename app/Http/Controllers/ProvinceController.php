<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provinces;

class ProvinceController extends Controller
{
    public function index(Request $request)
    {
        $provinceId = $request->query('province_id'); 
    
        if ($provinceId) {
            $province = Provinces::find($provinceId);
    
            if (!$province) {
                return response()->json([
                    'status' => false,
                    'message' => 'Province not found'
                ], 404);
            }
    
            return response()->json([
                'status' => true,
                'message' => 'Province details',
                'data' => $province
            ], 200);
        } else {
            $provinces = Provinces::all();
            return response()->json($provinces);
        }
    }
    public function all()
    {

    } 

    public function store(Request $request)
    {
        $request->validate([
            'province' => 'required|string|max:255'
        ]);

        $province = Provinces::create($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Province created successfully',
            'data' => $province
        ], 201);
    }

    public function show($id)
    {
        $province = Provinces::find($id);

        if (!$province) {
            return response()->json([
                'status' => false,
                'message' => 'Province not found'
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Province details',
            'data' => $province
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $province = Provinces::find($id);

        if (!$province) {
            return response()->json([
                'status' => false,
                'message' => 'Province not found'
            ], 404);
        }

        $request->validate([
            'province' => 'required|string|max:255'
        ]);

        $province->update($request->all());

        return response()->json([
            'status' => true,
            'message' => 'Province updated successfully',
            'data' => $province
        ], 200);
    }

    public function destroy($id)
    {
        $province = Provinces::find($id);

        if (!$province) {
            return response()->json([
                'status' => false,
                'message' => 'Province not found'
            ], 404);
        }

        $province->delete();

        return response()->json([
            'status' => true,
            'message' => 'Province deleted successfully'
        ], 200);
    }
}
