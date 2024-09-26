<?php

namespace App\Exports;

use App\Models\Coordinate;
use Maatwebsite\Excel\Concerns\FromArray;

class CoordinatesExport implements FromArray
{
    protected $coordinates;

    public function __construct(array $coordinates)
    {
        $this->coordinates = $coordinates;
    }

    public function array(): array
    {
        return $this->coordinates;
    }
}
