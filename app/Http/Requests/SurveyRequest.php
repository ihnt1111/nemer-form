<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SurveyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $phones = collect($this->input('phones', []))
            ->filter(static function ($phone) {
                return !empty($phone['phone']);
            })
            ->values()
            ->all();

        $this->merge(['phones' => $phones]);
    }

    public function rules(): array
    {
        return [
            'first_name'      => ['required', 'string', 'max:100'],
            'last_name'       => ['required', 'string', 'max:100'],
            'middle_name'     => ['nullable', 'string', 'max:100'],
            'birth_date'      => ['required', 'date', 'before:today'],
            'email'           => ['nullable', 'email', 'max:255'],
            'marital_status'  => ['nullable', 'in:single,married,divorced,widowed'],
            'about'           => ['nullable', 'string', 'max:1000'],
            'agreed_to_rules' => ['accepted'],

            'phones'                => ['array', 'max:6'],
            'phones.*.country_code' => ['required', 'in:+48,+44,+49'],
            'phones.*.phone'        => ['required', 'string', 'regex:/^\d{6,15}$/'],
        ];
    }

    /**
     * Проверка на email или хотя бы один телефон.
     */
    public function withValidator($validator): void
    {
        $hasEmail = !empty($this->input('email'));
        $hasPhone = !empty($this->input('phones'));

        $validator->after(static function ($v) use ($hasEmail, $hasPhone) {
            self::validateEmailOrPhone($v, $hasEmail, $hasPhone);
        });
    }

    protected static function validateEmailOrPhone($validator, bool $hasEmail, bool $hasPhone): void
    {
        if (!$hasEmail && !$hasPhone) {
            $validator->errors()->add('email', 'Podaj e-mail lub telefon.');
            $validator->errors()->add('phones', 'Podaj e-mail lub telefon.');
        }
    }

    public function messages(): array
    {
        return [
            'first_name.required'      => 'Imię jest wymagane.',
            'last_name.required'       => 'Nazwisko jest wymagane.',
            'birth_date.required'      => 'Data urodzenia jest wymagana.',
            'birth_date.before'        => 'Data urodzenia musi być z przeszłości.',
            'email.email'              => 'Nieprawidłowy adres e-mail.',
            'about.max'                => 'Maksymalnie 1000 znaków.',
            'agreed_to_rules.accepted' => 'Musisz zaakceptować zasady.',
            'phones.max'               => 'Maksymalnie 6 numerów.',
            'phones.*.phone.regex'     => 'Nieprawidłowy numer telefonu.',
        ];
    }
}