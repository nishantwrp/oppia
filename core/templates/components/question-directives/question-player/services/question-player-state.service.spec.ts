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
 * @fileoverview Unit tests for the question player state service.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// question-player-state.service.ts is upgraded to Angular 8.
import { AnswerGroupObjectFactory } from
  'domain/exploration/AnswerGroupObjectFactory';
import { FractionObjectFactory } from 'domain/objects/FractionObjectFactory';
import { HintObjectFactory } from 'domain/exploration/HintObjectFactory';
import { OutcomeObjectFactory } from
  'domain/exploration/OutcomeObjectFactory';
import { ParamChangeObjectFactory } from
  'domain/exploration/ParamChangeObjectFactory';
import { ParamChangesObjectFactory } from
  'domain/exploration/ParamChangesObjectFactory';
import { RecordedVoiceoversObjectFactory } from
  'domain/exploration/RecordedVoiceoversObjectFactory';
import { RuleObjectFactory } from 'domain/exploration/RuleObjectFactory';
import { SubtitledHtmlObjectFactory } from
  'domain/exploration/SubtitledHtmlObjectFactory';
import { UnitsObjectFactory } from 'domain/objects/UnitsObjectFactory';
import { VoiceoverObjectFactory } from
  'domain/exploration/VoiceoverObjectFactory';
import { WrittenTranslationObjectFactory } from
  'domain/exploration/WrittenTranslationObjectFactory';
import { WrittenTranslationsObjectFactory } from
  'domain/exploration/WrittenTranslationsObjectFactory';
import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.

require(
  'components/question-directives/question-player/services/' +
  'question-player-state.service.ts');
require('domain/question/QuestionObjectFactory.ts');

describe('Question player state service', function() {
  var qpservice;
  var QuestionObjectFactory;
  var questionId = 'question_1';
  var question;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value(
      'AnswerGroupObjectFactory', new AnswerGroupObjectFactory(
        new OutcomeObjectFactory(new SubtitledHtmlObjectFactory()),
        new RuleObjectFactory()));
    $provide.value('FractionObjectFactory', new FractionObjectFactory());
    $provide.value(
      'HintObjectFactory', new HintObjectFactory(
        new SubtitledHtmlObjectFactory()));
    $provide.value(
      'OutcomeObjectFactory', new OutcomeObjectFactory(
        new SubtitledHtmlObjectFactory()));
    $provide.value('ParamChangeObjectFactory', new ParamChangeObjectFactory());
    $provide.value(
      'ParamChangesObjectFactory', new ParamChangesObjectFactory(
        new ParamChangeObjectFactory()));
    $provide.value(
      'RecordedVoiceoversObjectFactory',
      new RecordedVoiceoversObjectFactory(new VoiceoverObjectFactory()));
    $provide.value('RuleObjectFactory', new RuleObjectFactory());
    $provide.value(
      'SubtitledHtmlObjectFactory', new SubtitledHtmlObjectFactory());
    $provide.value('UnitsObjectFactory', new UnitsObjectFactory());
    $provide.value('VoiceoverObjectFactory', new VoiceoverObjectFactory());
    $provide.value(
      'WrittenTranslationObjectFactory',
      new WrittenTranslationObjectFactory());
    $provide.value(
      'WrittenTranslationsObjectFactory',
      new WrittenTranslationsObjectFactory(
        new WrittenTranslationObjectFactory()));
  }));
  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));
  beforeEach(angular.mock.inject(function($injector) {
    qpservice = $injector.get('QuestionPlayerStateService');
    QuestionObjectFactory = $injector.get('QuestionObjectFactory');
    question = QuestionObjectFactory.createFromBackendDict({
      id: questionId,
      questionStateData: {
        content: {
          html: 'Question 1',
          contentId: 'content_1'
        },
        interaction: {
          answerGroups: [{
            outcome: {
              dest: 'outcome 1',
              feedback: {
                contentId: 'content_5',
                html: ''
              },
              labelledAsCorrect: true,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }],
            taggedSkillMisconceptionId: 'skill_id_1-0'
          }],
          confirmedUnclassifiedAnswers: [],
          customizationArgs: {},
          defaultOutcome: {
            dest: null,
            feedback: {
              html: 'Correct Answer',
              contentId: 'content_2'
            },
            paramChanges: [],
            labelledAsCorrect: false
          },
          hints: [
            {
              hintContent: {
                html: 'Hint 1',
                contentId: 'content_3'
              }
            }
          ],
          solution: {
            correctAnswer: 'This is the correct answer',
            answerIsExclusive: false,
            explanation: {
              html: 'Solution explanation',
              contentId: 'content_4'
            }
          },
          id: 'TextInput'
        },
        paramChanges: [],
        recordedVoiceovers: {
          voiceoversMapping: {
            content1: {},
            content2: {},
            content3: {},
            content4: {},
            content5: {}
          }
        },
        writtenTranslations: {
          translationsMapping: {
            content1: {},
            content2: {},
            content3: {},
            content4: {},
            content5: {}
          }
        },
        solicitAnswerDetails: false
      },
      languageCode: 'en',
      version: 1,
      linkedSkillIds: ['skill_id1', 'skill_id2']
    });
  }));

  it('should return an empty question state dictionary', function() {
    expect(qpservice.getQuestionPlayerStateData()).toEqual({});
  });

  it('should add a hint to the question state data', function() {
    qpservice.hintUsed(question);
    var stateData = qpservice.getQuestionPlayerStateData();
    expect(stateData[questionId]).toBeTruthy();
    expect(stateData[questionId].usedHints).toBeDefined();
    expect(stateData[questionId].usedHints.length).toEqual(1);
    expect(stateData[questionId].usedHints[0].timestamp).toBeDefined();
    expect(stateData[questionId].usedHints[0].timestamp).toBeGreaterThan(0);
    expect(stateData[questionId].linkedSkillIds).toBeTruthy();
    expect(stateData[questionId].linkedSkillIds).toEqual(
      ['skill_id1', 'skill_id2']);
  });

  it('should record a wrong answer was submitted to the question state data',
    function() {
      qpservice.answerSubmitted(question, false, 'skill_id_1-0');
      var stateData = qpservice.getQuestionPlayerStateData();
      expect(stateData[questionId]).toBeTruthy();
      expect(stateData[questionId].answers).toBeDefined();
      expect(stateData[questionId].answers.length).toEqual(1);
      expect(stateData[questionId].answers[0].isCorrect).toEqual(false);
      expect(stateData[questionId].answers[0].timestamp).toBeGreaterThan(0);
      expect(stateData[questionId].answers[0].taggedSkillMisconceptionId)
        .toEqual('skill_id_1-0');
      expect(stateData[questionId].linkedSkillIds).toBeTruthy();
      expect(stateData[questionId].linkedSkillIds).toEqual(
        ['skill_id1', 'skill_id2']);
    });

  it('should record a right answer was submitted to the question state data',
    function() {
      qpservice.answerSubmitted(question, true, 'skill_id_1-0');
      var stateData = qpservice.getQuestionPlayerStateData();
      expect(stateData[questionId]).toBeTruthy();
      expect(stateData[questionId].answers).toBeDefined();
      expect(stateData[questionId].answers.length).toEqual(1);
      expect(stateData[questionId].answers[0].isCorrect).toEqual(true);
      expect(stateData[questionId].answers[0].timestamp).toBeGreaterThan(0);
      expect(stateData[questionId].answers[0].taggedSkillMisconceptionId)
        .toEqual('skill_id_1-0');
      expect(stateData[questionId].linkedSkillIds).toBeTruthy();
      expect(stateData[questionId].linkedSkillIds).toEqual(
        ['skill_id1', 'skill_id2']);
    });

  it('should record that a solution was viewed',
    function() {
      qpservice.solutionViewed(question);
      var stateData = qpservice.getQuestionPlayerStateData();
      expect(stateData[questionId]).toBeTruthy();
      expect(stateData[questionId].viewedSolution).toBeDefined();
      expect(stateData[questionId].viewedSolution.timestamp).toBeDefined();
      expect(
        stateData[questionId].viewedSolution.timestamp).toBeGreaterThan(0);
      expect(stateData[questionId].linkedSkillIds).toBeTruthy();
      expect(stateData[questionId].linkedSkillIds).toEqual(
        ['skill_id1', 'skill_id2']);
    });

  it('should shouldn\'t record a correct answer if a solution was viewed',
    function() {
      qpservice.solutionViewed(question);
      var stateData = qpservice.getQuestionPlayerStateData();
      expect(stateData[questionId]).toBeTruthy();
      expect(stateData[questionId].viewedSolution).toBeDefined();
      expect(stateData[questionId].viewedSolution.timestamp).toBeDefined();
      expect(
        stateData[questionId].viewedSolution.timestamp).toBeGreaterThan(0);
      qpservice.answerSubmitted(question, true);
      expect(stateData[questionId]).toBeTruthy();
      expect(stateData[questionId].answers.length).toEqual(0);
      expect(stateData[questionId].linkedSkillIds).toBeTruthy();
      expect(stateData[questionId].linkedSkillIds).toEqual(
        ['skill_id1', 'skill_id2']);
    });
});
