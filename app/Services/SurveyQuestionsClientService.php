<?php

namespace App\Services;

use App\Models\SurveyQuestion;

class SurveyQuestionsClientService
{
    /**
     * Активные вопросы для SPA: ключ — stable_id, значение — объект как в surveyQuestionsStub (ключи survey.* без перевода).
     *
     * @return array<string, array<string, mixed>>
     */
    public function getActiveQuestionsKeyedByStableId(): array
    {
        $rows = SurveyQuestion::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $questions = [];
        foreach ($rows as $row) {
            $questions[$row->stable_id] = $this->mapRowToClientPayload($row);
        }

        return $questions;
    }

    /**
     * @return array<string, mixed>
     */
    private function mapRowToClientPayload(SurveyQuestion $row): array
    {
        $out = [
            'id' => $row->stable_id,
            'question_text' => $row->question_text,
            'type' => $row->type,
        ];

        if ($row->subtitle !== null) {
            $out['subtitle'] = $row->subtitle;
        }

        if ($row->field_caption !== null) {
            $out['field_caption'] = $row->field_caption;
        }

        if ($row->other_detail_field_label !== null) {
            $out['other_detail_field_label'] = $row->other_detail_field_label;
        }

        if ($row->options !== null) {
            $out['options'] = $row->options;
        }

        if ($row->option_groups !== null) {
            $out['option_groups'] = $row->option_groups;
        }

        if ($row->branches !== null) {
            $out['branches'] = $row->branches;
        }

        if ($row->checkbox_allow_empty !== null) {
            $out['checkbox_allow_empty'] = (bool) $row->checkbox_allow_empty;
        }

        if ($row->country_iso_select !== null) {
            $out['country_iso_select'] = (bool) $row->country_iso_select;
        }

        if ($row->text_multiline !== null) {
            $out['text_multiline'] = (bool) $row->text_multiline;
        }

        if ($row->text_rows !== null) {
            $out['text_rows'] = (int) $row->text_rows;
        }

        if ($row->text_allow_empty !== null) {
            $out['text_allow_empty'] = (bool) $row->text_allow_empty;
        }

        return $out;
    }
}
