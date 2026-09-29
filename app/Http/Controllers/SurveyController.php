<?php

namespace App\Http\Controllers;

use App\Actions\CreateSurvey;
use App\Http\Requests\SurveyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SurveyController extends Controller
{
    public function index(): View
    {
        return view('survey.index');
    }

    public function store(SurveyRequest $request, CreateSurvey $action): JsonResponse|RedirectResponse
    {
        $action->execute($request->validated());

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('survey.success');
    }

    public function success(): View
    {
        return view('survey.success');
    }
}