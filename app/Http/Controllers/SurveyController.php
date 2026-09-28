<?php

namespace App\Http\Controllers;

use App\Actions\CreateSurvey;
use App\Http\Requests\SurveyRequest;

class SurveyController extends Controller
{
    public function index()
    {
        return view('survey.index');
    }

    public function store(SurveyRequest $request, CreateSurvey $action)
    {
        $action->execute($request->validated());

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect()->route('survey.success');
    }

    public function success()
    {
        return view('survey.success');
    }
}