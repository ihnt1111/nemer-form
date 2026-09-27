<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Validator;
use Tests\TestCase;

class SurveyValidationTest extends TestCase
{
    private function rules(): array
    {
        return (new \App\Http\Requests\SurveyRequest())->rules();
    }

    public function test_first_name_is_required(): void
    {
        $v = Validator::make([
            'last_name' => 'Kavinsky',
            'birth_date' => '1990-01-01',
            'agreed_to_rules' => '1',
            'email' => 'test@example.com',
        ], $this->rules());

        $this->assertTrue($v->fails());
        $this->assertArrayHasKey('first_name', $v->errors()->toArray());
    }

    public function test_birth_date_must_be_in_the_past(): void
    {
        $v = Validator::make([
            'first_name' => 'Jan',
            'last_name' => 'Kavinsky',
            'birth_date' => '2099-01-01',
            'agreed_to_rules' => '1',
            'email' => 'test@example.com',
        ], $this->rules());

        $this->assertTrue($v->fails());
        $this->assertArrayHasKey('birth_date', $v->errors()->toArray());
    }

    public function test_email_has_max_255(): void
    {
        $v = Validator::make([
            'first_name' => 'Jan',
            'last_name' => 'Kavinsky',
            'birth_date' => '1990-01-01',
            'agreed_to_rules' => '1',
            'email' => str_repeat('a', 250) . '@example.com',
        ], $this->rules());

        $this->assertTrue($v->fails());
        $this->assertArrayHasKey('email', $v->errors()->toArray());
    }

    public function test_valid_data_passes(): void
    {
        $v = Validator::make([
            'first_name' => 'Jan',
            'last_name' => 'Kavinsky',
            'birth_date' => '1990-01-01',
            'agreed_to_rules' => '1',
            'email' => 'test@example.com',
            'phones' => [
                ['country_code' => '+48', 'phone' => '123456789'],
            ],
        ], $this->rules());

        $this->assertFalse($v->fails(), print_r($v->errors()->toArray(), true));
    }
}