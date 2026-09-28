<?php

namespace Database\Factories;

use App\Models\Survey;
use App\Models\SurveyPhone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SurveyPhone>
 */
class SurveyPhoneFactory extends Factory
{
    protected $model = SurveyPhone::class;

    public function definition(): array
    {
        return [
            'country_code' => fake()->randomElement(['+48', '+44', '+49']),
            'phone'        => fake()->numerify('#########'),
        ];
    }
}