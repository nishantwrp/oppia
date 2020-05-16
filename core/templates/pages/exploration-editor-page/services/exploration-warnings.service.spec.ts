// Copyright 2020 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for ExplorationWarningsService.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// exploration-editor-tab.directive.ts is upgraded to Angular 8.
import { AngularNameService } from
  'pages/exploration-editor-page/services/angular-name.service';
import { AnswerClassificationResultObjectFactory } from
  'domain/classifier/AnswerClassificationResultObjectFactory';
import { AnswerGroupObjectFactory } from
  'domain/exploration/AnswerGroupObjectFactory';
import { AnswerStatsObjectFactory } from
  'domain/exploration/AnswerStatsObjectFactory';
import { ClassifierObjectFactory } from
  'domain/classifier/ClassifierObjectFactory';
import { ExplorationDraftObjectFactory } from
  'domain/exploration/ExplorationDraftObjectFactory';
import { ExplorationFeaturesService } from
  'services/exploration-features.service';
import { FractionObjectFactory } from 'domain/objects/FractionObjectFactory';
import { HintObjectFactory } from 'domain/exploration/HintObjectFactory';
import { ImprovementsService } from 'services/improvements.service';
import { OutcomeObjectFactory } from
  'domain/exploration/OutcomeObjectFactory';
import { ParamChangeObjectFactory } from
  'domain/exploration/ParamChangeObjectFactory';
import { ParamChangesObjectFactory } from
  'domain/exploration/ParamChangesObjectFactory';
import { ParamMetadataObjectFactory } from
  'domain/exploration/ParamMetadataObjectFactory';
import { RecordedVoiceoversObjectFactory } from
  'domain/exploration/RecordedVoiceoversObjectFactory';
import { RuleObjectFactory } from 'domain/exploration/RuleObjectFactory';
/* eslint-disable max-len */
import { SolutionValidityService } from
  'pages/exploration-editor-page/editor-tab/services/solution-validity.service';
/* eslint-enable max-len */
import { StateClassifierMappingService } from
  'pages/exploration-player-page/services/state-classifier-mapping.service';
/* eslint-disable max-len */
import { StateEditorService } from
  'components/state-editor/state-editor-properties-services/state-editor.service';
/* eslint-enable max-len */
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

require('pages/exploration-editor-page/services/graph-data.service');
require('pages/exploration-editor-page/services/exploration-property.service');
/* eslint-disable max-len */
require('pages/exploration-editor-page/services/exploration-init-state-name.service');
/* eslint-enable max-len */

describe('Exploration Warnings Service', function() {
  var ExplorationWarningsService = null;
  var ExplorationStatesService = null;
  var StateTopAnswersStatsService = null;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value('AngularNameService', new AngularNameService());
    $provide.value(
      'AnswerClassificationResultObjectFactory',
      new AnswerClassificationResultObjectFactory());
    $provide.value(
      'AnswerGroupObjectFactory', new AnswerGroupObjectFactory(
        new OutcomeObjectFactory(new SubtitledHtmlObjectFactory()),
        new RuleObjectFactory()));
    $provide.value(
      'AnswerStatsObjectFactory', new AnswerStatsObjectFactory());
    $provide.value('ClassifierObjectFactory', new ClassifierObjectFactory());
    $provide.value(
      'ExplorationDraftObjectFactory', new ExplorationDraftObjectFactory());
    $provide.value(
      'ExplorationFeaturesService', new ExplorationFeaturesService());
    $provide.value('FractionObjectFactory', new FractionObjectFactory());
    $provide.value(
      'HintObjectFactory', new HintObjectFactory(
        new SubtitledHtmlObjectFactory()));
    $provide.value('ImprovementsService', new ImprovementsService());
    $provide.value(
      'OutcomeObjectFactory', new OutcomeObjectFactory(
        new SubtitledHtmlObjectFactory()));
    $provide.value(
      'ParamChangeObjectFactory', new ParamChangeObjectFactory());
    $provide.value(
      'ParamChangesObjectFactory', new ParamChangesObjectFactory(
        new ParamChangeObjectFactory()));
    $provide.value(
      'ParamMetadataObjectFactory', new ParamMetadataObjectFactory());
    $provide.value(
      'RecordedVoiceoversObjectFactory',
      new RecordedVoiceoversObjectFactory(new VoiceoverObjectFactory()));
    $provide.value('RuleObjectFactory', new RuleObjectFactory());
    $provide.value('SolutionValidityService', new SolutionValidityService());
    $provide.value(
      'StateClassifierMappingService', new StateClassifierMappingService(
        new ClassifierObjectFactory()));
    $provide.value(
      'StateEditorService', new StateEditorService(
        new SolutionValidityService()));
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

  describe('when exploration param changes has jinja values', function() {
    beforeEach(angular.mock.module('oppia', function($provide) {
      $provide.value('ExplorationInitStateNameService', {
        savedMemento: 'Hola'
      });
      $provide.value('ExplorationParamChangesService', {
        savedMemento: [{
          customizationArgs: {
            parse_with_jinja: false,
            value: '5'
          },
          generatorId: 'Copier',
          name: 'ParamChange1'
        }, {
          customizationArgs: {
            parse_with_jinja: true,
            value: '{{ParamChange2}}'
          },
          generatorId: 'Copier',
        }, {
          customizationArgs: {
            parse_with_jinja: true,
            value: '5'
          },
          generatorId: 'RandomSelector',
          name: 'ParamChange3'
        }]
      });
    }));
    beforeEach(angular.mock.inject(function($injector) {
      ExplorationWarningsService = $injector.get('ExplorationWarningsService');
      ExplorationStatesService = $injector.get('ExplorationStatesService');
      StateTopAnswersStatsService = $injector.get(
        'StateTopAnswersStatsService');
    }));

    it('should update warnings with TextInput as interaction id', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recordedVoiceovers: {
            voiceoversMapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'TextInput',
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'Hola',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is' +
        ' set before it is referred to in the initial list of parameter' +
        ' changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.hasCriticalWarnings())
        .toBe(true);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings with Continue as interaction id', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recorded_voiceovers: {
            voiceovers_mapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'Continue',
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }, {
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'Hola',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              },
              buttonText: {
                value: ''
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer groups have classifiers' +
        ' with no training data: 0, 1'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings())
        .toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'The button text should not be empty.',
          'Only the default outcome is necessary for a continue interaction.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when no interaction id is provided', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recordedVoiceovers: {
            voiceoversMapping: {},
          },
          paramChanges: [],
          interaction: {
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'Hola',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {},
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Please add an interaction to this card.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when there is a solution in the interaction',
      function() {
        ExplorationStatesService.init({
          Hola: {
            content: {
              contentId: 'content',
              html: '{{HtmlValue}}'
            },
            recordedVoiceovers: {
              voiceoversMapping: {},
            },
            paramChanges: [],
            interaction: {
              id: 'TextInput',
              solution: {
                correctAnswer: 'This is the correct answer',
                answerIsExclusive: false,
                explanation: {
                  html: 'Solution explanation'
                }
              },
              answerGroups: [{
                outcome: {
                  dest: '',
                  feedback: {
                    contentId: 'feedback_1',
                    html: ''
                  },
                },
                ruleSpecs: [],
                trainingData: []
              }],
              defaultOutcome: {
                dest: 'Hola',
                feedback: {
                  contentId: '',
                  html: '',
                },
              },
              customizationArgs: {
                rows: {
                  value: true
                },
                placeholder: {
                  value: 1
                }
              },
              hints: [],
            },
            writtenTranslations: {
              translationsMapping: {
                content: {},
                defaultOutcome: {},
              },
            },
          }
        });
        ExplorationWarningsService.updateWarnings();

        expect(ExplorationWarningsService.getWarnings()).toEqual([{
          type: 'critical',
          message: 'Please ensure the value of parameter "ParamChange2"' +
          ' is set before it is referred to in the initial list of' +
          ' parameter changes.'
        }, {
          type: 'critical',
          message: 'Please ensure the value of parameter "HtmlValue" is set' +
          ' before using it in "Hola".'
        }, {
          type: 'error',
          message: 'The following card has errors: Hola.'
        }, {
          type: 'error',
          message: 'In \'Hola\', the following answer group has a classifier' +
          ' with no training data: 0'
        }]);
        expect(ExplorationWarningsService.countWarnings()).toBe(4);
        expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
        expect(ExplorationWarningsService.getAllStateRelatedWarnings())
          .toEqual({
            Hola: [
              'Placeholder text must be a string.',
              'Number of rows must be integral.',
              'The current solution does not lead to another card.',
              'There\'s no way to complete the exploration starting from' +
              ' this card. To fix this, make sure that the last card in' +
              ' the chain starting from this one has an \'End Exploration\'' +
              ' question type.'
            ]
          });
      });

    it('should update warnings when state top answers stats is initiated',
      function() {
        ExplorationStatesService.init({
          Hola: {
            content: {
              contentId: 'content',
              html: '{{HtmlValue}}'
            },
            recordedVoiceovers: {
              voiceoversMapping: {},
            },
            paramChanges: [],
            interaction: {
              id: 'TextInput',
              solution: {
                correctAnswer: 'This is the correct answer',
                answerIsExclusive: false,
                explanation: {
                  html: 'Solution explanation'
                }
              },
              answerGroups: [{
                outcome: {
                  dest: '',
                  feedback: {
                    contentId: 'feedback_1',
                    html: ''
                  },
                },
                ruleSpecs: [],
                trainingData: []
              }],
              defaultOutcome: {
                dest: 'Hola',
                feedback: {
                  contentId: '',
                  html: '',
                },
              },
              customizationArgs: {
                rows: {
                  value: true
                },
                placeholder: {
                  value: 1
                }
              },
              hints: [],
            },
            writtenTranslations: {
              translationsMapping: {
                content: {},
                defaultOutcome: {},
              },
            },
          }
        });
        StateTopAnswersStatsService.init({
          answers: {
            Hola: [{
              answer: 'hola',
              frequency: 7,
              isAddressed: false
            }]
          },
          interaction_ids: {
            Hola: 'TextInput'
          },
        });
        ExplorationWarningsService.updateWarnings();

        expect(ExplorationWarningsService.getWarnings()).toEqual([{
          type: 'critical',
          message: 'Please ensure the value of parameter "ParamChange2" is' +
          ' set before it is referred to in the initial list of parameter' +
          ' changes.'
        }, {
          type: 'critical',
          message: 'Please ensure the value of parameter "HtmlValue" is set' +
          ' before using it in "Hola".'
        }, {
          type: 'error',
          message: 'The following card has errors: Hola.'
        }, {
          type: 'error',
          message: 'In \'Hola\', the following answer group has a classifier' +
          ' with no training data: 0'
        }]);
        expect(ExplorationWarningsService.countWarnings()).toBe(4);
        expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
        expect(ExplorationWarningsService.getAllStateRelatedWarnings())
          .toEqual({
            Hola: [
              'Placeholder text must be a string.',
              'Number of rows must be integral.',
              'There is an answer among the top 10 which has no explicit' +
              ' feedback.',
              'The current solution does not lead to another card.',
              'There\'s no way to complete the exploration starting from' +
              ' this card. To fix this, make sure that the last card in' +
              ' the chain starting from this one has an \'End Exploration\'' +
              ' question type.'
            ]
          });
      });

    it('should update warnings when state name is not equal to the default' +
    ' outcome destination', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recordedVoiceovers: {
            voiceovers_mapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correctAnswer: 'This is the correct answer',
              answerIsExclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'State',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following card has errors: Hola.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(4);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'There\'s no way to complete the exploration starting from this' +
          ' card. To fix this, make sure that the last card in the chain' +
          ' starting from this one has an \'End Exploration\' question type.'
        ]
      });
    });

    it('should update warnings when there are two states but only one saved' +
    ' memento value', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recordedVoiceovers: {
            voiceoversMapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correctAnswer: 'This is the correct answer',
              answerIsExclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'Hola',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        },
        State: {
          content: {
            contentId: 'content',
            html: '{{HtmlValue}}'
          },
          recordedVoiceovers: {
            voiceoversMapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'TextInput',
            solution: {
              correctAnswer: 'This is the correct answer',
              answerIsExclusive: false,
              explanation: {
                html: 'Solution explanation'
              }
            },
            answerGroups: [{
              outcome: {
                dest: '',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [],
              trainingData: []
            }],
            defaultOutcome: {
              dest: 'State',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: true
              },
              placeholder: {
                value: 1
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([{
        type: 'critical',
        message: 'Please ensure the value of parameter "ParamChange2" is set' +
        ' before it is referred to in the initial list of parameter changes.'
      }, {
        type: 'critical',
        message: 'Please ensure the value of parameter "HtmlValue" is set' +
        ' before using it in "Hola".'
      }, {
        type: 'error',
        message: 'The following cards have errors: Hola, State.'
      }, {
        type: 'error',
        message: 'In \'Hola\', the following answer group has a classifier' +
        ' with no training data: 0'
      }, {
        type: 'error',
        message: 'In \'State\', the following answer group has a classifier' +
        ' with no training data: 0'
      }]);
      expect(ExplorationWarningsService.countWarnings()).toBe(5);
      expect(ExplorationWarningsService.hasCriticalWarnings()).toBe(true);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual({
        Hola: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'The current solution does not lead to another card.',
        ],
        State: [
          'Placeholder text must be a string.',
          'Number of rows must be integral.',
          'The current solution does not lead to another card.',
          'This card is unreachable.'
        ]
      });
    });
  });

  describe('when exploration param changes has no jinja values', function() {
    beforeEach(angular.mock.module('oppia', function($provide) {
      $provide.value('ExplorationInitStateNameService', {
        savedMemento: 'Hola'
      });
      $provide.value('ExplorationParamChangesService', {
        savedMemento: [{
          customizationArgs: {
            parse_with_jinja: true,
            value: ''
          },
          generatorId: 'Copier',
        }]
      });
    }));
    beforeEach(angular.mock.inject(function($injector) {
      ExplorationWarningsService = $injector.get('ExplorationWarningsService');
      ExplorationStatesService = $injector.get('ExplorationStatesService');
    }));

    it('should update warning to an empty array', function() {
      ExplorationStatesService.init({
        Hola: {
          content: {
            contentId: 'content',
            html: ''
          },
          recordedVoiceovers: {
            voiceoversMapping: {},
          },
          paramChanges: [],
          interaction: {
            id: 'TextInput',
            answerGroups: [{
              outcome: {
                dest: 'State',
                feedback: {
                  contentId: 'feedback_1',
                  html: ''
                },
              },
              ruleSpecs: [{
                inputs: {
                  x: 10
                },
                ruleType: 'Equals'
              }],
              trainingData: ['1']
            }],
            defaultOutcome: {
              dest: '',
              feedback: {
                contentId: '',
                html: '',
              },
            },
            customizationArgs: {
              rows: {
                value: 1
              },
              placeholder: {
                value: 'placeholder value'
              }
            },
            hints: [],
          },
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
            },
          },
        },
        State: {
          paramChanges: [],
          content: {
            contentId: '',
            html: ''
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {}
            }
          },
          interaction: {
            id: 'EndExploration',
            defaultOutcome: null,
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {
              recommendedExplorationIds: {
                value: []
              }
            },
            solution: null,
            answerGroups: [],
            hints: []
          },
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {}
            }
          },
          classifierModelId: null
        }
      });
      ExplorationWarningsService.updateWarnings();

      expect(ExplorationWarningsService.getWarnings()).toEqual([]);
      expect(ExplorationWarningsService.getAllStateRelatedWarnings()).toEqual(
        {});
    });
  });
});
