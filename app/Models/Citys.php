<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citys extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'province_id'
    ];

    public function province()
    {
        return $this->belongsTo(Provinces::class, 'province_id');
    }
}