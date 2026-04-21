<?php

namespace App\Http\Requests\Client;

use App\Http\Requests\Concerns\NormalizesPayload;
use Illuminate\Foundation\Http\FormRequest;

class ContactSubmitRequest extends FormRequest
{
    use NormalizesPayload;

    /**
     * Разрешает любые анонимные запросы к публичной форме Contact.
     * Авторизация не требуется — это публичный лендинг без аккаунтов.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Правила валидации payload формы Contact.
     * hp_company и hp_elapsed — служебные поля honeypot, не сохраняются в БД,
     * но валидируются чтобы отсечь некорректные типы (пригодится при анализе спам-паттернов).
     * hp_elapsed — количество секунд с момента открытия формы, считается на клиенте
     * (не абсолютный timestamp — иначе рассинхрон часов клиент/сервер ломает проверку).
     */
    public function rules(): array
    {
        return [
            'name'       => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email:rfc', 'max:255'],
            'company'    => ['nullable', 'string', 'max:255'],
            'message'    => ['required', 'string', 'min:10', 'max:2000'],
            'hp_company' => ['nullable', 'string', 'max:255'],
            'hp_elapsed' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Нормализует входящий payload перед валидацией: trim строковых полей, lowercase email,
     * пустые строки → null, hp_elapsed приводится к int. Даёт стабильное поведение required/max
     * независимо от того, прислал клиент "" или не прислал поле вообще.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'       => $this->nullableString($this->input('name')),
            'email'      => $this->normalizeEmail($this->input('email')),
            'company'    => $this->nullableString($this->input('company')),
            'message'    => $this->nullableString($this->input('message')),
            'hp_company' => $this->nullableString($this->input('hp_company')),
            'hp_elapsed' => $this->nullableInt($this->input('hp_elapsed')),
        ]);
    }
}
