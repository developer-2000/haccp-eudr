<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации для запроса авторизации
     * Определяет требования к полям email, password и device_name.
     * Email должен быть валидным адресом, password - минимум 8 символов с цифрами.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
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
                Password::min(8)->numbers(),
            ],

            'device_name' => [
                'required',
                'string',
                'max:255',
            ],
        ];
    }

    /**
     * Кастомные сообщения об ошибках валидации
     * Все ошибки валидации возвращают единое сообщение "The user credentials were incorrect."
     * для обеспечения безопасности и предотвращения утечки информации о структуре данных.
     * Используется для защиты от перебора учетных данных и скрытия деталей валидации.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'The user credentials were incorrect.',
            'email.email' => 'The user credentials were incorrect.',
            'email.max' => 'The user credentials were incorrect.',
            'password.required' => 'The user credentials were incorrect.',
            'password.min' => 'The user credentials were incorrect.',
            'password.numbers' => 'The user credentials were incorrect.',
            'password.max' => 'The user credentials were incorrect.',
            'device_name.required' => 'The user credentials were incorrect.',
            'device_name.string' => 'The user credentials were incorrect.',
            'device_name.max' => 'The user credentials were incorrect.',
        ];
    }
}
