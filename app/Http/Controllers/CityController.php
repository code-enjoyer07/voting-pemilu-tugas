<?php

namespace App\Http\Controllers;

use App\Models\Citys;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CityController extends Controller
{
    public function index()
    {
        $data = Citys::all();
        if($data->isEmpty()) {
            return response()->json([
                'message' => 'not found'
            ]);
        }
        return response()->json($data);
    }

    public function create(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'city' => 'required|string',
            'province_id' => 'required|numeric'
        ]);

        if($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ]);
        }

        $data = new Citys();
        $data->city = $request->city;
        $data->province_id = $request->province_id;
        $data->save();

        return response()->json([
            'message' => 'succes'
        ]);
    }

    public function destroy($id) {
        $data = Citys::find($id);

        if(!$data) {
            return response()->json([
                'message' => 'not found'
            ], 404);
        }

        return response()->json([
            'message' => 'succes delete'
        ]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'city' => 'required|string',
            'province_id' => 'required|numeric'
        ]);

        if($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors() 
            ]);
        }

        $data = Citys::find($id);
        $data->city = $request->city;
        $data->province_id = $request->province_id;
        $data->update();
        
        return response()->json([
            'message' => 'success update'
        ]);
    }
}
