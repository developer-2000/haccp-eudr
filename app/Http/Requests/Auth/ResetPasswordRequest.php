<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации для запроса сброса пароля
     * @return array
     */
    public function rules(): array
    {
        return [
            'token' => [
                'required',
                'string',
                'max:255',
            ],
            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
            ],
            'password' => [
                'required',
                'string',
                'max:255',
                'confirmed',
                Password::min(8)->numbers(),
            ],
        ];
    }

    /**
     * Кастомные сообщения об ошибках валидации
     * Все ошибки валидации возвращают единое сообщение для обеспечения безопасности
     * и предотвращения утечки информации о структуре данных.
     * Используется для защиты от перебора токенов и скрытия деталей валидации.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $errorMessage = 'Failed to reset the password. Please try repeating the password reset request procedure.';

        return [
            'token.required' => $errorMessage,
            'token.string' => $errorMessage,
            'token.max' => $errorMessage,
            'email.required' => $errorMessage,
            'email.email' => $errorMessage,
            'email.string' => $errorMessage,
            'email.max' => $errorMessage,
            'password.required' => $errorMessage,
            'password.min' => $errorMessage,
            'password.numbers' => $errorMessage,
            'password.confirmed' => $errorMessage,
            'password.string' => $errorMessage,
            'password.max' => $errorMessage,
        ];
    }
}
