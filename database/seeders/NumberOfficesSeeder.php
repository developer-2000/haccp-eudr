<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NumberOfficesSeeder extends Seeder
{
    public function run(): void
    {
        $numberOffices = config('site.account.company.number_offices', []);

        $data = [];
        foreach ($numberOffices as $code => $name) {
            $data[] = [
                'code' => $code,
                'name' => $name,
            ];
        }

        if (!empty($data)) {
            DB::table('com_number_offices')->insert($data);
        }
    }
}

