<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CoordinateController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/coordinate', [CoordinateController::class, 'getCoordinates']);
