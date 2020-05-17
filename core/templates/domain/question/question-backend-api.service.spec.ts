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
 * @fileoverview Unit tests for QuestionBackendApiService.
 */

import { HttpClientTestingModule, HttpTestingController } from
  '@angular/common/http/testing';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { QuestionBackendApiService } from
  'domain/question/question-backend-api.service.ts';

describe('Question backend Api service', () => {
  let questionBackendApiService = null;
  let sampleDataResults = null;
  let sampleResponse = null;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    questionBackendApiService = TestBed.get(QuestionBackendApiService);
    httpTestingController = TestBed.get(HttpTestingController);

    // Sample question object returnable from the backend
    sampleDataResults = {
      questionDicts: [{
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
            hints: [{
              hintContent: {
                html: 'Hint 1'
              }
            }],
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
      }]
    };

    sampleResponse = {
      questionSummaryDicts: [{
        skillDescriptions: [],
        summary: {
          creatorId: '1',
          createdOnMsec: 0,
          lastUpdatedMsec: 0,
          id: '0',
          questionContent: ''
        }
      }],
      nextStartCursor: null
    };
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should successfully fetch questions from the backend', fakeAsync(() => {
    let successHandler = jasmine.createSpy('success');
    let failHandler = jasmine.createSpy('fail');

    let questionPlayerHandlerUrl =
      '/question_player_handler?skill_ids=1&question_count=1' +
      '&fetch_by_difficulty=true';

    questionBackendApiService.fetchQuestions(
      ['1'], 1, true).then(successHandler, failHandler);

    let req = httpTestingController.expectOne(questionPlayerHandlerUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(sampleDataResults);

    flushMicrotasks();

    expect(successHandler).toHaveBeenCalledWith(
      sampleDataResults.questionDicts);
    expect(failHandler).not.toHaveBeenCalled();
  }));

  it('should successfully fetch questions from the backend when' +
      'sortedByDifficulty is false', fakeAsync(() => {
    let successHandler = jasmine.createSpy('success');
    let failHandler = jasmine.createSpy('fail');

    let questionPlayerHandlerUrl =
      '/question_player_handler?skill_ids=1&question_count=1' +
      '&fetch_by_difficulty=false';

    questionBackendApiService.fetchQuestions(
      ['1'], 1, false).then(successHandler, failHandler);

    let req = httpTestingController.expectOne(questionPlayerHandlerUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(sampleDataResults);

    flushMicrotasks();

    expect(successHandler).toHaveBeenCalledWith(
      sampleDataResults.questionDicts);
    expect(failHandler).not.toHaveBeenCalled();
  }));

  it('should use the fail handler if the backend request failed',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      let questionPlayerHandlerUrl =
        '/question_player_handler?skill_ids=1&question_count=1' +
        '&fetch_by_difficulty=true';

      questionBackendApiService.fetchQuestions(
        ['1'], 1, true).then(successHandler, failHandler);

      let req = httpTestingController.expectOne(questionPlayerHandlerUrl);
      expect(req.request.method).toEqual('GET');
      req.flush('Error loading questions.', {
        status: 500, statusText: 'Invaid request'
      });

      flushMicrotasks();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith(
        'Error loading questions.');
    })
  );

  it('should use the fail handler if question count is in invalid format',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        ['1'], 'abc', true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Question count has to be a ' +
        'positive integer');
    })
  );

  it('should use the fail handler if question count is negative',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        ['1'], -1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Question count has to be a ' +
        'positive integer');
    })
  );

  it('should use the fail handler if question count is not an integer',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        ['1'], 1.5, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Question count has to be a ' +
        'positive integer');
    })
  );

  it('should use the fail handler if skill ids is not a list',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        'x', 1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );

  it('should use the fail handler if skill ids is not a list of strings',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        [1, 2], 1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );

  it('should use the fail handler if skill ids is sent as null',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        null, 1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );

  it('should use the fail handler if question count is sent as null',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestions(
        ['1'], null, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Question count has to be a ' +
        'positive integer');
    })
  );

  it('should successfully fetch questions for editors from the backend',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      questionBackendApiService.fetchQuestionSummaries(
        ['1']).then(successHandler, failHandler);
      let req = httpTestingController.expectOne(
        '/questions_list_handler/1?cursor=');
      expect(req.request.method).toEqual('GET');
      req.flush(sampleResponse);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalledWith({
        questionSummaries: sampleResponse.question_summary_dicts,
        nextCursor: null
      });
      expect(failHandler).not.toHaveBeenCalled();
    })
  );

  it('should use the rejection handler if the backend request failed',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      questionBackendApiService.fetchQuestionSummaries(
        ['1']).then(successHandler, failHandler);
      let req = httpTestingController.expectOne(
        '/questions_list_handler/1?cursor=');
      expect(req.request.method).toEqual('GET');
      req.flush('Error loading questions.', {
        status: 500, statusText: 'Invaid request'
      });

      flushMicrotasks();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Error loading questions.');
    })
  );

  it('should successfully fetch questions from the backend with cursor',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');

      questionBackendApiService.fetchQuestionSummaries(
        ['1'], '1').then(successHandler, failHandler);
      let req = httpTestingController.expectOne(
        '/questions_list_handler/1?cursor=1');
      expect(req.request.method).toEqual('GET');
      req.flush(sampleResponse);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalledWith({
        questionSummaries: sampleResponse.question_summary_dicts,
        nextCursor: null
      });
      expect(failHandler).not.toHaveBeenCalled();
    })
  );

  it('should use the fail handler if skill ids is not a list',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestionSummaries(
        'x', 1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );

  it('should use the fail handler if skill ids is not a list of strings',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestionSummaries(
        [1, 2], 2, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );

  it('should use the fail handler if skill ids is sent as null',
    fakeAsync(() => {
      let successHandler = jasmine.createSpy('success');
      let failHandler = jasmine.createSpy('fail');
      questionBackendApiService.fetchQuestionSummaries(
        null, 1, true).then(successHandler, failHandler);
      flushMicrotasks();
      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith('Skill ids should be a list of' +
      ' strings');
    })
  );
});
