// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for PretestQuestionBackendApiService.
 */

import { HttpClientTestingModule, HttpTestingController } from
  '@angular/common/http/testing';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { PretestQuestionBackendApiService } from
  'domain/question/pretest-question-backend-api.service';

describe('Pretest question backend API service', function() {
  let pretestQuestionBackendApiService:
    PretestQuestionBackendApiService = null;
  let httpTestingController: HttpTestingController;

  var ERROR_STATUS_CODE = 500;

  var sampleDataResults = {
    pretestQuestionDicts: [{
      id: '0',
      questionStateData: {
        content: {
          html: 'Question 1'
        },
        recordedVoiceovers: {
          voiceoversMapping: {}
        },
        interaction: {
          answerGroups: [],
          confirmedUnclassifiedAnswers: [],
          customizationArgs: {},
          defaultOutcome: {
            dest: null,
            feedback: {
              html: 'Correct Answer'
            },
            paramChanges: [],
            labelledAsCorrect: true
          },
          hints: [
            {
              hintContent: {
                html: 'Hint 1'
              }
            }
          ],
          solution: {
            correctAnswer: 'This is the correct answer',
            answerIsExclusive: false,
            explanation: {
              html: 'Solution explanation'
            }
          },
          id: 'TextInput'
        },
        paramChanges: [],
        solicitAnswerDetails: false
      },
      languageCode: 'en',
      version: 1
    }],
    next_start_cursor: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PretestQuestionBackendApiService]
    });
    pretestQuestionBackendApiService = TestBed.get(
      PretestQuestionBackendApiService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should successfully fetch pretest questions from the backend',
    fakeAsync(() => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      pretestQuestionBackendApiService.fetchPretestQuestions(
        'expId', 'storyId').then(successHandler, failHandler);

      var req = httpTestingController.expectOne(
        '/pretest_handler/expId?story_id=storyId&cursor=');
      expect(req.request.method).toEqual('GET');
      req.flush(sampleDataResults);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalledWith(
        sampleDataResults.pretestQuestionDicts);
      expect(failHandler).not.toHaveBeenCalled();
    })
  );

  it('should use the rejection handler if the backend request failed',
    fakeAsync(() => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      pretestQuestionBackendApiService.fetchPretestQuestions(
        'expId', 'storyId').then(successHandler, failHandler);

      var req = httpTestingController.expectOne(
        '/pretest_handler/expId?story_id=storyId&cursor=');
      expect(req.request.method).toEqual('GET');
      req.flush('Error loading data.', {
        status: ERROR_STATUS_CODE, statusText: 'Invalid Request'
      });

      flushMicrotasks();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalled();
    })
  );
});
