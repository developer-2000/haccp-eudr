<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\RegisterCompanyRequest;
use App\Http\Requests\Auth\RegisterPhoneRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ForgotPassword;

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
            'user' => $this->getUserData($user),
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
     * Авторизация клиента
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Проверяем учетные данные
        if (!Auth::attempt([
            'email' => $data['email'],
            'password' => $data['password'],
        ])) {
            return $this->getErrorResponse('The user credentials were incorrect.', [], 401);
        }

        /** @var User $user */
        $user = Auth::user();

        // 1 Удаляем старые токены для этого устройства (опционально)
        $user->tokens()->where('name', $data['device_name'])->delete();

        // 2 Создаем новый токен
        $token = $user
            ->createToken($data['device_name'])
            ->plainTextToken;

        // 3 Определяем статус завершения профиля
        $hasCompany = Company::where('user_id', $user->id)->exists();
        $hasPhone = !empty($user->phone);

        $profileCompletion = [
            'account' => true,
            'company' => $hasCompany,
            'phone' => $hasPhone,
            'completed' => $hasCompany && $hasPhone,
        ];

        return $this->getSuccessResponse('', [
            'user' => $this->getUserData($user),
            'token' => $token,
            'profile_completion' => $profileCompletion,
        ]);
    }

    /**
     * Восстановление пароля
     * @param ForgotPasswordRequest $request
     * @return JsonResponse
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $data = $request->validated();

        // Проверяем существование пользователя
        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            // Для безопасности возвращаем успешный ответ даже если пользователь не найден
            return $this->getSuccessResponse(
                'If the email address exists in our system, we will send you a password reset link.',
                []
            );
        }

        // Генерируем токен
        $token = Password::broker()->createToken($user);

        // Отправляем кастомное уведомление
        try {
            $user->notify(new ForgotPassword($token, $user->email));

            return $this->getSuccessResponse(
                'Password reset link has been sent to your email address.',
                []
            );
        } catch (\Exception $e) {
            return $this->getErrorResponse(
                'Unable to send password reset link. Please try again later.',
                [],
                500
            );
        }
    }

    /**
     * Сброс пароля
     * @param ResetPasswordRequest $request
     * @return JsonResponse
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        // 1 Сбрасываем пароль используя стандартный функционал Laravel
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return $this->getSuccessResponse(
                'Password has been reset successfully. You can now login with your new password.',
                []
            );
        }

        return $this->getErrorResponse(
            'Unable to reset password. The token may be invalid or expired.',
            [],
            400
        );
    }

    /**
     * Logout
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->getSuccessResponse('', []);
    }

    /**
     * Формирует массив данных пользователя для ответа API
     * @param User $user
     * @return array
     */
    private function getUserData(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}


