<?php

namespace App\Actions;

use App\Models\Survey;
use Illuminate\Support\Facades\DB;

class CreateSurvey
{
    /**
     * @throws \Throwable
     */
    public function execute(array $data): Survey // transaction: сначала INSERT анкеты, потом телефонов
    {
        return DB::transaction(static function () use ($data) {
            $survey = Survey::create($data);

            if (!empty($data['phones'])) {
                $survey->phones()->createMany($data['phones']);
            }

            return $survey;
        });
    }
}