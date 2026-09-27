<?php

namespace App\Http\Controllers;

use App\Http\Requests\SurveyRequest;
use App\Models\Survey;
use Illuminate\Support\Facades\DB;

class SurveyController extends Controller
{
    public function index()
    {
        return view('survey.index');
    }

    /**
     * @throws \Throwable
     */
    public function store(SurveyRequest $request)
    {
        DB::transaction(function () use ($request) {
            $survey = Survey::create($request->validated());

            if (!empty($request->input('phones'))) {
                $survey->phones()->createMany($request->input('phones'));
            }
        });

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