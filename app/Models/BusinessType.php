<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BusinessType extends Model
{
    public $timestamps = false;

    protected $table = 'com_business_types';

    protected $fillable = [
        'code',
        'name',
    ];
}

