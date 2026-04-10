<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyResponse extends Model
{
    protected $table = 'survey_responses';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'business_name',
        'business_type',
        'country',
        'status_responses',
        'attempt_counter',
        'verification_code',
        'verification_token',
        'answers',
        'discount_code',
        'discount_granted',
    ];

    protected $casts = [
        'answers' => 'array',
        'attempt_counter' => 'integer',
        'verification_code' => 'integer',
        'discount_granted' => 'boolean',
    ];
}

