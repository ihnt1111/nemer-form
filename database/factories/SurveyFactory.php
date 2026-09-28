<?php

namespace Database\Factories;

use App\Models\Survey;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Survey>
 */
class SurveyFactory extends Factory
{
    protected $model = Survey::class;

    public function definition(): array
    {
        return [
            'first_name'      => fake()->firstName(),
            'last_name'       => fake()->lastName(),
            'middle_name'     => fake()->optional(0.5)->firstName(),
            'birth_date'      => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'email'           => fake()->optional(0.8)->safeEmail(),
            'marital_status'  => fake()->randomElement(['single', 'married', 'divorced', 'widowed']),
            'about'           => fake()->optional(0.6)->text(300),
            'agreed_to_rules' => true,
        ];
    }
}