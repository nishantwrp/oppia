// Copyright 2016 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for TrainingModalController.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.

describe('Training Modal Controller', function() {
  var $rootScope = null;
  var $scope = null;
  var $uibModalInstance;
  var callbackSpy = jasmine.createSpy('callback');
  var StateEditorService = null;
  var ExplorationStatesService = null;
  var StateInteractionIdService = null;
  var ResponsesService = null;
  var InteractionObjectFactory = null;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module(function($provide) {
    $provide.value('ExplorationDataService', {
      explorationId: 0,
      autosaveChangeList: function() {},
      discardDraft: function() {}
    });
  }));
  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));
  beforeEach(angular.mock.inject(function($injector) {
    $rootScope = $injector.get('$rootScope');
    StateEditorService = $injector.get('StateEditorService');
    ExplorationStatesService = $injector.get('ExplorationStatesService');
    StateInteractionIdService = $injector.get('StateInteractionIdService');
    ResponsesService = $injector.get('ResponsesService');
    InteractionObjectFactory = $injector.get('InteractionObjectFactory');
  }));

  describe('when answer group index is equal to response answer groups count',
    function() {
      beforeEach(angular.mock.inject(function($injector, $controller) {
        callbackSpy = jasmine.createSpy('callback');
        $uibModalInstance = jasmine.createSpyObj(['close', 'dismiss']);
        ExplorationStatesService.init({
          Init: {
            content: {
              contentId: '',
              html: ''
            },
            recordedVoiceovers: {
              voiceoversMapping: {},
            },
            paramChanges: [],
            interaction: {
              id: 'TextInput',
              answerGroups: [{
                ruleSpecs: [],
                outcome: {
                  dest: '',
                  feedback: {
                    contentId: '',
                    html: '',
                  }
                },
                trainingData: ['Not the answer']
              }, {
                ruleSpecs: [],
                outcome: {
                  dest: '',
                  feedback: {
                    contentId: '',
                    html: '',
                  }
                },
                trainingData: ['This is the answer']
              }],
              defaultOutcome: {
                dest: '',
                feedback: {
                  contentId: '',
                  html: '',
                },
              },
              hints: [],
            },
            writtenTranslations: {
              translationsMapping: {},
            }
          },
        });
        StateEditorService.activeStateName = 'Init';
        StateInteractionIdService.init('Init', 'TextInput');
        ResponsesService.init(InteractionObjectFactory.createFromBackendDict({
          id: 'TextInput',
          answerGroups: [{
            outcome: {
              dest: 'Init',
              feedback: {
                contentId: '',
                html: ''
              },
            },
            trainingData: ['This is the answer'],
            ruleSpecs: [],
          }],
          defaultOutcome: {
            dest: 'Init',
            feedback: {
              contentId: '',
              html: '',
            }
          },
          hints: [],
          confirmedUnclassifiedAnswers: []
        }));

        $scope = $rootScope.$new();
        $controller('TrainingModalController', {
          $scope: $scope,
          $injector: $injector,
          $uibModalInstance: $uibModalInstance,
          unhandledAnswer: 'This is the answer',
          finishTrainingCallback: callbackSpy
        });
      }));

      it('should click on confirm button', function() {
        var answerGroups = (
          ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));
        var defaultOutcome = (
          ExplorationStatesService.getInteractionDefaultOutcomeMemento(
            'Init'));

        expect(answerGroups[0].outcome.dest).toBe('');
        expect(answerGroups[0].trainingData).toEqual(
          ['Not the answer']);
        expect(answerGroups[1].outcome.dest).toBe('');
        expect(answerGroups[1].trainingData).toEqual(
          ['This is the answer']);
        expect(defaultOutcome.dest).toBe('');

        $scope.onConfirm();
        expect($uibModalInstance.close).toHaveBeenCalled();
        expect(callbackSpy).toHaveBeenCalled();

        var updatedAnswerGroups = (
          ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));
        var updatedDefaultOutcome = (
          ExplorationStatesService.getInteractionDefaultOutcomeMemento(
            'Init'));

        expect(updatedAnswerGroups[0].outcome.dest).toBe('Init');
        expect(updatedAnswerGroups[0].trainingData).toEqual([]);
        expect(updatedDefaultOutcome.dest).toBe('Init');
      });

      it('should exit training modal', function() {
        $scope.exitTrainer();
        expect($uibModalInstance.dismiss).toHaveBeenCalled();
      });
    });

  describe('when anwer group index is greater than response answer groups' +
    ' count', function() {
    var $scope = null;
    var $uibModalInstance;
    var callbackSpy = jasmine.createSpy('callback');
    var StateEditorService = null;
    var ExplorationStatesService = null;
    var StateInteractionIdService = null;
    var ResponsesService = null;
    var InteractionObjectFactory = null;

    beforeEach(angular.mock.inject(function($injector, $controller) {
      var $rootScope = $injector.get('$rootScope');
      StateEditorService = $injector.get('StateEditorService');
      ExplorationStatesService = $injector.get('ExplorationStatesService');
      StateInteractionIdService = $injector.get('StateInteractionIdService');
      ResponsesService = $injector.get('ResponsesService');
      InteractionObjectFactory = $injector.get('InteractionObjectFactory');

      $uibModalInstance = jasmine.createSpyObj(['close', 'dismiss']);
      ExplorationStatesService.init({
        Init: {
          content: {
            contentId: '',
            html: ''
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
                  contentId: '',
                  html: '',
                }
              },
              trainingData: ['Not the answer'],
              ruleSpecs: [],
            }, {
              outcome: {
                dest: '',
                feedback: {
                  contentId: '',
                  html: '',
                },
              },
              trainingData: ['Answer'],
              ruleSpecs: []
            }, {
              outcome: {
                dest: '',
                feedback: {
                  contentId: '',
                  html: '',
                }
              },
              trainingData: ['This is the answer'],
              ruleSpecs: [],
            }],
            defaultOutcome: {
              dest: '',
              feedback: {
                contentId: '',
                html: '',
              }
            },
            hints: [],
            id: 'TextInput',
            customizationArgs: {
              rows: {
                value: 1
              },
              placeholder: {
                value: 'Type your answer here.'
              }
            },
          },
          writtenTranslations: {
            translationsMapping: {},
          }
        },
      });
      StateEditorService.activeStateName = 'Init';
      StateInteractionIdService.init('Init', 'TextInput');
      ResponsesService.init(InteractionObjectFactory.createFromBackendDict({
        id: 'TextInput',
        answerGroups: [{
          outcome: {
            dest: 'Init',
            feedback: {
              contentId: '',
              html: ''
            },
          },
          trainingData: ['This is the answer'],
          ruleSpecs: [],
        }],
        defaultOutcome: {
          dest: 'Init',
          feedback: {
            contentId: '',
            html: '',
          }
        },
        hints: [],
        confirmedUnclassifiedAnswers: []
      }));
      $scope = $rootScope.$new();
      $controller('TrainingModalController', {
        $scope: $scope,
        $injector: $injector,
        $uibModalInstance: $uibModalInstance,
        unhandledAnswer: 'This is the answer',
        finishTrainingCallback: callbackSpy
      });
    }));

    it('should click on confirm button', function() {
      var answerGroups = (
        ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));
      expect(answerGroups[0].trainingData).toEqual(['Not the answer']);
      expect(answerGroups[1].trainingData).toEqual(['Answer']);
      expect(answerGroups[2].trainingData).toEqual(['This is the answer']);

      $scope.onConfirm();
      expect($uibModalInstance.close).toHaveBeenCalled();

      var upgatedAnswerGroups = (
        ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));
      expect(upgatedAnswerGroups[0].trainingData).toEqual([]);
      expect(upgatedAnswerGroups[1].trainingData).toEqual(
        ['This is the answer']);
      expect(upgatedAnswerGroups[2]).toBeUndefined();
    });

    it('should exit training modal', function() {
      $scope.exitTrainer();
      expect($uibModalInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe('when anwer group index is less than response answer groups count',
    function() {
      beforeEach(angular.mock.inject(function($injector, $controller) {
        var $rootScope = $injector.get('$rootScope');
        StateEditorService = $injector.get('StateEditorService');
        ExplorationStatesService = $injector.get('ExplorationStatesService');
        StateInteractionIdService = $injector.get('StateInteractionIdService');
        ResponsesService = $injector.get('ResponsesService');
        InteractionObjectFactory = $injector.get('InteractionObjectFactory');

        $uibModalInstance = jasmine.createSpyObj(['close', 'dismiss']);
        ExplorationStatesService.init({
          Init: {
            content: {
              contentId: '',
              html: ''
            },
            recordedVoiceovers: {
              voiceoversMapping: {},
            },
            paramChanges: [],
            interaction: {
              answerGroups: [{
                ruleSpecs: [],
                outcome: {
                  dest: '',
                  feedback: {
                    contentId: '',
                    html: '',
                  },
                },
                trainingData: ['']
              }],
              defaultOutcome: {
                dest: '',
                feedback: {
                  contentId: '',
                  html: '',
                },
              },
              hints: [],
              id: 'TextInput',
            },
            writtenTranslations: {
              translationsMapping: {},
            }
          },
        });
        StateEditorService.activeStateName = 'Init';
        StateInteractionIdService.init('Init', 'TextInput');
        ResponsesService.init(InteractionObjectFactory.createFromBackendDict({
          id: 'TextInput',
          answerGroups: [{
            outcome: {
              dest: 'Init',
              feedback: {
                contentId: '',
                html: ''
              },
            },
            ruleSpecs: [],
            trainingData: []
          }, {
            outcome: {
              dest: 'Hola',
              feedback: {
                contentId: '',
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
          confirmedUnclassifiedAnswers: [],
          customizationArgs: {
            rows: {
              value: true
            },
            placeholder: {
              value: 1
            }
          },
          hints: [],
        }));
        $scope = $rootScope.$new();
        $controller('TrainingModalController', {
          $scope: $scope,
          $injector: $injector,
          $uibModalInstance: $uibModalInstance,
          unhandledAnswer: 'This is the answer',
          finishTrainingCallback: callbackSpy
        });
      }));

      it('should click on confirm button', function() {
        var answerGroups = (
          ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));

        expect(answerGroups[0].trainingData).toEqual(['']);
        expect(answerGroups[1]).toBeUndefined();

        $scope.onConfirm();
        expect($uibModalInstance.close).toHaveBeenCalled();
        expect(callbackSpy).toHaveBeenCalled();

        var upgatedAnswerGroups = (
          ExplorationStatesService.getInteractionAnswerGroupsMemento('Init'));

        expect(upgatedAnswerGroups[0].trainingData).toEqual([]);
        expect(upgatedAnswerGroups[1].trainingData).toEqual(
          ['This is the answer']);
      });

      it('should exit training modal', function() {
        $scope.exitTrainer();
        expect($uibModalInstance.dismiss).toHaveBeenCalled();
      });
    });
});
