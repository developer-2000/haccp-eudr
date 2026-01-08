<?php

namespace App\Http\Controllers;

use App\Models\BusinessType;
use App\Models\Country;
use App\Models\EmployeeCount;
use App\Models\NumberOffices;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ReferenceDataController extends BaseController
{
    /**
     * Получение справочных данных для регистрации компании
     * Кешируется на 1 час
     * @return JsonResponse
     */
    public function getCompanyReferenceData(): JsonResponse
    {
        // Кеш на 1 час: если есть - возвращает из кеша, если нет - запрашивает из БД и кеширует
        $data = Cache::remember('company_reference_data', 3600, function () {
            $businessTypes = BusinessType::all()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->name,
                    'value' => $item->id,
                ];
            });

            $countries = Country::all()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->name,
                    'value' => $item->id,
                ];
            });

            $employeeCounts = EmployeeCount::all()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->name,
                    'value' => $item->id,
                ];
            });

            $numberOffices = NumberOffices::all()->map(function ($item) {
                return [
                    'id' => $item->id,
                    'label' => $item->name,
                    'value' => $item->id,
                ];
            });

            return [
                'name' => config('app.name', 'HACCP-EUDR'),
                'business_types' => $businessTypes,
                'countries' => $countries,
                'employee_counts' => $employeeCounts,
                'number_offices' => $numberOffices,
            ];
        });

        return $this->getSuccessResponse('', $data);
    }
}

