<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoordinateController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/password/change', [AuthController::class, 'changePassword']);
Route::get('/users', [AuthController::class, 'getAllUsers']);
Route::delete('/user', [AuthController::class, 'deleteUser']);
Route::post('/equisde/update', [AuthController::class, 'updateUser']);
Route::post('/equisde/create', [AuthController::class, 'createUser']);
Route::post('/coordinate', [CoordinateController::class, 'getCoordinates']);
Route::post('/coordinate/paginated', [CoordinateController::class, 'getCoordinatesPaginated']);
Route::post('/coordinate/paginated/download', [CoordinateController::class, 'exportCoordinatesAsExcel']);
