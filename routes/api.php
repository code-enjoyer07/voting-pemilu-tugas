<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});


Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::put('/ban/{id}', [UserController::class, 'ban']);
        Route::delete('/{id}', [UserController::class, 'destroy']);
        Route::put('/{id}', [UserController::class, 'update']);
    });
    Route::prefix('province')->group(function () {
        Route::get('/', [ProvinceController::class, 'index']);
        Route::post('/', [ProvinceController::class, 'store']);
        Route::get('/{id}', [ProvinceController::class, 'show']);
        Route::put('/{id}', [ProvinceController::class, 'update']);
        Route::delete('/{id}', [ProvinceController::class, 'destroy']);
    });
    Route::prefix('city')->group(function () {
        Route::get('/', [CityController::class, 'index']);
        Route::post('/', [CityController::class, 'create']);
        Route::put('/{id}', [CityController::class, 'update']);
        Route::delete('/{id}', [CityController::class, 'destroy']);
    });
    Route::get('/results', [ResultController::class, 'index']);
    Route::post('/results', [ResultController::class, 'store']);
    Route::get('/results/all', [ResultController::class, 'all']);


    Route::get('/results/01', [ResultController::class, 'satu']);
    Route::get('/results/02', [ResultController::class, 'dua']);
    Route::get('/results/03', [ResultController::class, 'tiga']);
});
