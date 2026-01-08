<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    public $timestamps = false;

    protected $table = 'com_countries';

    protected $fillable = [
        'code',
        'name',
    ];
}

