<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CoordinatesExport;

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

    public function getCoordinatesPaginated(Request $request)
    {
        $request->validate([
            'token' => 'required',
        ]);
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $query = $request->input('query', '');
        $coordinateRequest = Http::withHeaders([
            'Authorization' => 'Bearer ' . $request->token
        ])
            ->get("http://104.154.142.250/apis/exam/positions");

        $coordinates = $coordinateRequest->json();
        if (!$coordinates) {
            return response()->json([
                'message' => "error",
                'coordinates' => [],
            ]);
        }
        $array = $coordinates["data"];
        if ($query) {
            $array = array_filter($array, function ($item) use ($query) {
                return stripos($item['country'], $query) !== false ||
                    stripos($item['state'], $query) !== false ||
                    stripos($item['eco'], $query) !== false;
            });
        }
        $offset = ($page - 1) * $limit;
        $paginatedArray = array_slice($array, $offset, $limit);
        return response()->json([
            'message' => "ok",
            'coordinates' => $paginatedArray,
            'total' => count($array),
            'page' => $page,
            'limit' => $limit,
        ]);
    }

    public function exportCoordinatesAsExcel(Request $request) {
        $request->validate([
            'token' => 'required',
        ]);
        $page = $request->input('page', 1);
        $limit = $request->input('limit', 10);
        $query = $request->input('query', '');
        $coordinateRequest = Http::withHeaders([
            'Authorization' => 'Bearer ' . $request->token
        ])
            ->get("http://104.154.142.250/apis/exam/positions");

        $coordinates = $coordinateRequest->json();
        if (!$coordinates) {
            return response()->json([
                'message' => "error",
                'coordinates' => [],
            ]);
        }
        $array = $coordinates["data"];
        if ($query) {
            $array = array_filter($array, function ($item) use ($query) {
                return stripos($item['country'], $query) !== false ||
                    stripos($item['state'], $query) !== false;
            });
        }
        $offset = ($page - 1) * $limit;
        $paginatedArray = array_slice($array, $offset, $limit);
        return Excel::download(new CoordinatesExport($paginatedArray), 'coordinates.xlsx');
    }
}
