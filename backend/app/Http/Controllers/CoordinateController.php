<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CoordinateController extends Controller
{
    public function getCoordinates(Request $request)
    {
        $request->validate([
            'token' => 'required',
        ]);

        $coordinateRequest = Http::withHeaders([
            'Authorization' => 'Bearer ' . $request->token
        ])
        ->get("http://104.154.142.250/apis/exam/positions");
        $coordinates = $coordinateRequest->json();
        $array = $coordinates["data"];

        if (!$coordinates) {
            return response()
                ->json([
                    'message' => "error",
                    'coordinates' => [],
                ]);
        }
        return response()
            ->json([
                'message' => "ok",
                'coordinates' => $array,
            ]);
    }
}
