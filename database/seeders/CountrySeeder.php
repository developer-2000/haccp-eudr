<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = config('site.account.company.countries', []);

        $data = [];
        foreach ($countries as $code => $name) {
            $data[] = [
                'code' => $code,
                'name' => $name,
            ];
        }

        if (!empty($data)) {
            DB::table('com_countries')->insert($data);
        }
    }
}

