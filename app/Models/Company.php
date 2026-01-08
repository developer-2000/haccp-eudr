<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'business_type_id',
        'country_id',
        'employee_count_id',
        'number_offices_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function businessType(): BelongsTo
    {
        return $this->belongsTo(BusinessType::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function employeeCount(): BelongsTo
    {
        return $this->belongsTo(EmployeeCount::class);
    }

    public function numberOffices(): BelongsTo
    {
        return $this->belongsTo(NumberOffices::class);
    }
}

