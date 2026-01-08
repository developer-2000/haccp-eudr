<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Http\Requests\Auth\RegisterPhoneRequest;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends BaseController
{
    /**
     * Регистрация клиента
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user
            ->createToken($data['device_name'])
            ->plainTextToken;

        return $this->getSuccessResponse('', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'token' => $token,
            'profile_completion' => [
                'account' => true,
                'company' => false,
                'phone' => false,
                'completed' => false,
            ]
        ]);
    }

    /**
     * Регистрация компании юзера
     * @param RegisterCompanyRequest $request
     * @return JsonResponse
     */
    public function registerCompany(RegisterCompanyRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Создаем новую компанию
        Company::create([
            'user_id' => $user->id,
            'name' => $data['company_name'] ?? null,
            'business_type_id' => $data['company_business_type'] ?? null,
            'country_id' => $data['company_country'] ?? null,
            'employee_count_id' => $data['company_employee_count'] ?? null,
            'number_offices_id' => $data['company_number_offices'] ?? null,
        ]);

        // Обновляем profile_completion
        $profileCompletion = [
            'account' => true,
            'company' => true,
            'phone' => false,
            'completed' => false,
        ];

        return $this->getSuccessResponse('Company data saved successfully', [
            'profile_completion' => $profileCompletion
        ]);
    }

    /**
     * Регистрация телефона юзера
     * @param RegisterPhoneRequest $request
     * @return JsonResponse
     */
    public function registerPhone(RegisterPhoneRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Обновляем телефон пользователя
        $user->phone = $data['phone_number'];
        $user->save();

        // Обновляем profile_completion
        $profileCompletion = [
            'account' => true,
            'company' => true,
            'phone' => true,
            'completed' => true,
        ];

        return $this->getSuccessResponse("Excellent. You can now proceed to configuring your company's settings.", [
            'profile_completion' => $profileCompletion
        ]);
    }

    /**
     * Logout
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        // $request->user()->tokens()->delete(); // удаляет все токены пользователя

        return $this->getSuccessResponse('', []);
    }
}


