<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Results extends Model
{
    use HasFactory;

    protected $table = 'results';

    protected $fillable = [
        'number',
        'presiden',
        'wakil_presiden',
        'province_id',
        'city_id',
        'user_id'
    ];

    public function province()
    {
        return $this->belongsTo(Provinces::class, 'province_id', 'id');
    }

    public function city()
    {
        return $this->belongsTo(Citys::class, 'city_id', 'id');
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
