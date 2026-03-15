<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppLog extends Model
{
    protected $table = 'app_logs';

    protected $fillable = [
        'message',
        'context',
    ];

    protected $casts = [
        'context' => 'array',
    ];
}
