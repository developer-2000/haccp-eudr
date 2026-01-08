<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeCountSeeder extends Seeder
{
    public function run(): void
    {
        $employeeCounts = config('site.account.company.employee_count', []);

        $data = [];
        foreach ($employeeCounts as $code => $name) {
            $data[] = [
                'code' => $code,
                'name' => $name,
            ];
        }

        if (!empty($data)) {
            DB::table('com_employee_counts')->insert($data);
        }
    }
}

