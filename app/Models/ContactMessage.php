<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Сообщение из публичной формы Contact.
 * Хранит основные данные отправителя (name, email, company, message) и технический срез
 * источника запроса (locale, ip, user_agent) в JSON-поле user_meta.
 */
class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    protected $fillable = [
        'name',
        'email',
        'company',
        'message',
        'type_site',
        'user_meta',
    ];

    protected $casts = [
        'user_meta' => 'array',
    ];
}
