<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации для запроса восстановления пароля
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
        ];
    }

    /**
     * Кастомные сообщения об ошибках валидации
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Please input your email',
            'email.email' => 'Please input a valid email address',
            'email.string' => 'Please input a valid email address',
            'email.max' => 'Please input a valid email address',
        ];
    }
}
