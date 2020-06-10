// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Rules service for the interaction.
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';

interface Answer {
  'assumptions_string': string,
  'target_string': string,
  'proof_string': string,
  'correct': boolean,
  'error_category'?: string,
  'error_code'?: string,
  'error_message'?: string,
  'error_line_number'?: number
}

@Injectable({
  providedIn: 'root'
})
export class LogicProofRulesService {
  Correct(answer: Answer): boolean {
    return answer.correct;
  }
  NotCorrect(answer: Answer): boolean {
    return !answer.correct;
  }
  NotCorrectByCategory(answer: Answer, inputs: {c: string}): boolean {
    return !answer.correct && answer.error_category === inputs.c;
  }
}

angular.module('oppia').factory(
  'LogicProofRulesService',
  downgradeInjectable(LogicProofRulesService));
