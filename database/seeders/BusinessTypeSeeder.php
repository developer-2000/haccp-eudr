<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BusinessTypeSeeder extends Seeder
{
    public function run(): void
    {
        $businessTypes = config('site.account.company.business_type', []);

        $data = [];
        foreach ($businessTypes as $code => $name) {
            $data[] = [
                'code' => $code,
                'name' => $name,
            ];
        }

        if (!empty($data)) {
            DB::table('com_business_types')->insert($data);
        }
    }
}

