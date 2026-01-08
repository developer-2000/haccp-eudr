<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterCompanyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => [
                'required',
                'string',
                'max:255',
            ],

            'company_business_type' => [
                'required',
                'integer',
                'exists:com_business_types,id',
            ],

            'company_country' => [
                'required',
                'integer',
                'exists:com_countries,id',
            ],

            'company_employee_count' => [
                'required',
                'integer',
                'exists:com_employee_counts,id',
            ],

            'company_number_offices' => [
                'required',
                'integer',
                'exists:com_number_offices,id',
            ],
        ];
    }
}

