<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NumberOffices extends Model
{
    public $timestamps = false;

    protected $table = 'com_number_offices';

    protected $fillable = [
        'code',
        'name',
    ];
}

