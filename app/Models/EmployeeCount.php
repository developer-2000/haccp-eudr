<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeCount extends Model
{
    public $timestamps = false;

    protected $table = 'com_employee_counts';

    protected $fillable = [
        'code',
        'name',
    ];
}

