<?php

namespace Database\Seeders;

use App\Models\Survey;
use App\Models\SurveyPhone;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Survey::factory()
            ->count(15)
            ->create()
            ->each(function (Survey $survey) {
                $survey->phones()->createMany(
                    SurveyPhone::factory()
                        ->count(rand(1, 3))
                        ->make()
                        ->toArray()
                );
            });
    }
}