# Nemer — survey form

Анкета на Laravel. Вёрстка по макету, валидация на клиенте и сервере.

Laravel survey form. Layout based on a mockup, client- and server-side validation.

---

## RU

### Стек

- PHP 8.5 / Laravel 13
- MySQL
- Blade
- Vite + SCSS
- Bootstrap 5 через npm (tree-shaking — только используемые утилиты)
- Bootstrap Icons (CDN)
- Vanilla JS (ES-модули)
- Work Sans (Google Fonts)

### Что нужно

PHP 8.2+, Composer, Node.js 18+, MySQL.

### Установка

    git clone https://github.com/ihnt1111/nemer-form.git
    cd nemer-form
    composer install
    npm install
    cp .env.example .env
    php artisan key:generate

### База данных

Создай базу:

    CREATE DATABASE nemer_form
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_0900_ai_ci;

В `.env` заполни:

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nemer_form
    DB_USERNAME=root
    DB_PASSWORD=

### Сборка фронтенда

    npm run build      # одноразовая сборка

### Запуск

    php artisan migrate --seed
    php artisan serve

Открыть http://127.0.0.1:8000

### Тесты

    php artisan test

---

## EN

### Stack

- PHP 8.5 / Laravel 13
- MySQL
- Blade
- Vite + SCSS
- Bootstrap 5 via npm (tree-shaking — only used utilities)
- Bootstrap Icons (CDN)
- Vanilla JS (ES modules)
- Work Sans (Google Fonts)

### Requirements

PHP 8.2+, Composer, Node.js 18+, MySQL.

### Install

    git clone https://github.com/ihnt1111/nemer-form.git
    cd nemer-form
    composer install
    npm install
    cp .env.example .env
    php artisan key:generate

### Database

Create the database:

    CREATE DATABASE nemer_form
        CHARACTER SET utf8mb4
        COLLATE utf8mb4_0900_ai_ci;

Fill `.env`:

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=nemer_form
    DB_USERNAME=root
    DB_PASSWORD=

### Frontend build

    npm run build      # one-time production build

### Run

    php artisan migrate --seed
    php artisan serve

Open http://127.0.0.1:8000

### Tests

    php artisan test