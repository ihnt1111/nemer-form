@extends('layouts.app')

@section('title', 'Nemer-Form')

@section('content')
    <section class="hero-section l">
        <div class="container">
            <div class="row align-items-center g-1">
                <div class="col-lg-6">
                    <h2 class="hero-title mb-4">Nasi kurierzy</h2>
                    <div class="partners-grid">
                        @foreach ([
                            ['file' => 'dpd',         'alt' => 'DPD'],
                            ['file' => 'gls',         'alt' => 'GLS'],
                            ['file' => 'dhl',         'alt' => 'DHL'],
                            ['file' => 'shopify',     'alt' => 'Shopify'],
                            ['file' => 'woocommerce', 'alt' => 'WooCommerce'],
                            ['file' => 'prestashop',  'alt' => 'PrestaShop'],
                            ['file' => 'ppl',         'alt' => 'PPL'],
                            ['file' => 'poczta',      'alt' => 'Poczta Polska'],
                            ['file' => 'magento',     'alt' => 'Magento'],
                        ] as $logo)
                            <div class="partner-card">
                                <img src="{{ asset('images/' . $logo['file'] . '.png') }}"
                                     alt="{{ $logo['alt'] }}"
                                     class="partner-logo">
                            </div>
                        @endforeach
                    </div>
                </div>
                <div class="col-lg-5">
                    <img src="{{ asset('images/hero-box.jpg') }}"
                         alt="Kurier z paczką"
                         class="hero-photo img-fluid">
                </div>
            </div>
        </div>
    </section>
    <section class="form-section py-5">
        <div class="container">
            <div class="row">
                <div class="col-lg-7">
                    <div class="form-card p-4 p-md-5">
                        <h1 class="form-title mb-2">Szukasz najlepszej oferty?</h1>
                        <p class="form-subtitle mb-4">Zostaw aplikację, a nasz menedżer skontaktuje się z Tobą w celu
                            konsultacji</p>
                        <form id="survey-form" method="POST" action="{{ route('survey.store') }}" novalidate>
                            @csrf
                            <div class="row g-3 mb-3">
                                <div class="col-md-4">
                                    <input type="text" id="first_name" name="first_name"
                                           value="{{ old('first_name') }}"
                                           placeholder="Twoje imię"
                                           class="form-control form-control-underline">
                                    @error('first_name')
                                    <div class="field-error">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="col-md-4">
                                    <input type="text" id="last_name" name="last_name"
                                           value="{{ old('last_name') }}"
                                           placeholder="Twoje nazwisko"
                                           class="form-control form-control-underline">
                                    @error('last_name')
                                    <div class="field-error">{{ $message }}</div>
                                    @enderror
                                </div>
                                <div class="col-md-4">
                                    <input type="text" id="middle_name" name="middle_name"
                                           value="{{ old('middle_name') }}"
                                           placeholder="Twoje drugie imię"
                                           class="form-control form-control-underline">
                                    @error('middle_name')
                                    <div class="field-error">{{ $message }}</div>
                                    @enderror
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="birth_date" class="form-label">Twoja data urodzenia</label>
                                <input type="date" id="birth_date" name="birth_date"
                                       value="{{ old('birth_date') }}"
                                       required
                                       class="form-control form-control-underline">
                                @error('birth_date')
                                <div class="field-error">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="mb-3">
                                <input type="email" id="email" name="email"
                                       value="{{ old('email') }}"
                                       placeholder="example@mail.com"
                                       class="form-control form-control-underline">
                                <div class="field-hint" id="email-phone-hint">Wymagany e-mail lub numer telefonu.</div>
                                @error('email')
                                <div class="field-error">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Telefon</label>
                                <div id="phones-wrapper">
                                    @php
                                        $phones = old('phones', [['country_code' => '+48', 'phone' => '']]);
                                    @endphp
                                    @foreach ($phones as $i => $p)
                                        <div class="phone-row d-flex align-items-center gap-2 mb-2">
                                            <select name="phones[{{ $i }}][country_code]"
                                                    class="form-select form-control-underline phone-code">
                                                <option value="+48" @selected(($p['country_code'] ?? '') === '+48')>+48</option>
                                                <option value="+44" @selected(($p['country_code'] ?? '') === '+44')>+44</option>
                                                <option value="+49" @selected(($p['country_code'] ?? '') === '+49')>+49</option>
                                            </select>
                                            <input type="tel" name="phones[{{ $i }}][phone]"
                                                   value="{{ $p['phone'] ?? '' }}"
                                                   placeholder="123456789"
                                                   class="form-control form-control-underline">

                                            @if ($i === 0)
                                                <button type="button" id="add-phone" class="btn-add-phone" aria-label="Dodaj telefon">
                                                    <i class="bi bi-plus-lg"></i>
                                                </button>
                                            @endif

                                            @if (count($phones) > 1)
                                                <button type="button" class="btn-remove-phone" aria-label="Usuń telefon">
                                                    <i class="bi bi-dash-lg"></i>
                                                </button>
                                            @endif
                                        </div>

                                        @error("phones.$i.phone")
                                        <div class="field-error mb-2">{{ $message }}</div>
                                        @enderror
                                    @endforeach
                                </div>

                                @error('phones')
                                <div class="field-error">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="mb-3">
                                <select id="marital_status" name="marital_status"
                                        class="form-select form-control-underline">
                                    <option value="" disabled @selected(!old('marital_status'))>Stan cywilny
                                        (Wybierz)...
                                    </option>
                                    <option value="single" @selected(old('marital_status') === 'single')>Kawaler/Panna
                                    </option>
                                    <option value="married" @selected(old('marital_status') === 'married')>
                                        Żonaty/Zamężna
                                    </option>
                                    <option value="divorced" @selected(old('marital_status') === 'divorced')>
                                        Rozwiedziony
                                    </option>
                                    <option value="widowed" @selected(old('marital_status') === 'widowed')>
                                        Wdowiec/Wdowa
                                    </option>
                                </select>
                                @error('marital_status')
                                <div class="field-error">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="mb-3">
                                <textarea id="about" name="about" rows="1"
                                          placeholder="O mnie..."
                                          class="form-control form-control-underline form-textarea">{{ old('about') }}</textarea>
                                @error('about')
                                <div class="field-error">{{ $message }}</div>
                                @enderror
                            </div>
                            <div class="d-flex align-items-center justify-content-between flex-wrap gap-3 mt-4">
                                <div class="form-check">
                                    <input type="checkbox" name="agreed_to_rules" value="1"
                                           id="agreed" @checked(old('agreed_to_rules'))
                                           class="form-check-input form-check-input-dark">
                                    <label for="agreed" class="form-check-label form-check-label-dark">
                                        Przeczytałem zasady
                                    </label>
                                    @error('agreed_to_rules')
                                    <div class="field-error">{{ $message }}</div>
                                    @enderror
                                </div>
                                <button type="submit" id="submit-btn" class="btn-submit" disabled>Wysłać</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content success-modal">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="bi bi-check-circle success-modal-icon"></i>
                    </div>
                    <h2 class="success-modal-title mb-3">Dziękujemy!</h2>
                    <p class="success-modal-text mb-4">
                        Twoja aplikacja została wysłana.
                    </p>
                    <button type="button" class="btn-submit" data-bs-dismiss="modal">
                        Zamknij
                    </button>
                </div>
            </div>
        </div>
    </div>
@endsection
@push('scripts')
    <script src="{{ asset('js/validation.js') }}"></script>
@endpush