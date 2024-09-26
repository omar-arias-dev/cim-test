<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoordinateController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/change', [AuthController::class, 'changePassword']);
Route::post('/coordinate', [CoordinateController::class, 'getCoordinates']);
Route::post('/coordinate/paginated', [CoordinateController::class, 'getCoordinatesPaginated']);
Route::post('/coordinate/paginated/download', [CoordinateController::class, 'exportCoordinatesAsExcel']);
