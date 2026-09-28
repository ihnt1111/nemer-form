<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @method static create(mixed $validated)
 */
class Survey extends Model
{
    use HasFactory;
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_name',
        'birth_date',
        'email',
        'marital_status',
        'about',
        'agreed_to_rules',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'agreed_to_rules' => 'boolean',
    ];


    public function phones(): HasMany
    {
        return $this->hasMany(SurveyPhone::class);
    }
}