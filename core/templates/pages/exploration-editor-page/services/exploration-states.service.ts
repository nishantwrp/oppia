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
 * @fileoverview Data service for keeping track of the exploration's states.
 * Note that this is unlike the other exploration property services, in that it
 * keeps no mementos.
 */

require(
  'components/common-layout-directives/common-elements/' +
  'confirm-or-cancel-modal.controller.ts');
require('domain/exploration/StatesObjectFactory.ts');
require('domain/utilities/url-interpolation.service.ts');
require('filters/string-utility-filters/normalize-whitespace.filter.ts');
require('pages/exploration-editor-page/services/angular-name.service.ts');
require('pages/exploration-editor-page/services/change-list.service.ts');
require(
  'pages/exploration-editor-page/services/' +
  'exploration-init-state-name.service.ts');
require(
  'pages/exploration-editor-page/editor-tab/services/' +
  'solution-validity.service.ts');
require(
  'pages/exploration-player-page/services/answer-classification.service.ts');
require(
  'components/state-editor/state-editor-properties-services/' +
  'state-editor.service.ts');
require('services/alerts.service.ts');
require('services/context.service.ts');
require('services/validators.service.ts');

angular.module('oppia').factory('ExplorationStatesService', [
  '$filter', '$injector', '$location', '$q', '$rootScope', '$uibModal',
  'AlertsService', 'AngularNameService', 'AnswerClassificationService',
  'ChangeListService', 'ContextService', 'ExplorationInitStateNameService',
  'SolutionValidityService', 'StateEditorService', 'StatesObjectFactory',
  'UrlInterpolationService', 'ValidatorsService',
  function(
      $filter, $injector, $location, $q, $rootScope, $uibModal,
      AlertsService, AngularNameService, AnswerClassificationService,
      ChangeListService, ContextService, ExplorationInitStateNameService,
      SolutionValidityService, StateEditorService, StatesObjectFactory,
      UrlInterpolationService, ValidatorsService) {
    var _states = null;

    var stateAddedCallbacks = [];
    var stateDeletedCallbacks = [];
    var stateRenamedCallbacks = [];
    var stateInteractionSavedCallbacks = [];

    // Properties that have a different backend representation from the
    // frontend and must be converted.
    var BACKEND_CONVERSIONS = {
      answerGroups: function(answerGroups) {
        return answerGroups.map(function(answerGroup) {
          return answerGroup.toBackendDict();
        });
      },
      content: function(content) {
        return content.toBackendDict();
      },
      recordedVoiceovers: function(recordedVoiceovers) {
        return recordedVoiceovers.toBackendDict();
      },
      defaultOutcome: function(defaultOutcome) {
        if (defaultOutcome) {
          return defaultOutcome.toBackendDict();
        } else {
          return null;
        }
      },
      hints: function(hints) {
        return hints.map(function(hint) {
          return hint.toBackendDict();
        });
      },
      paramChanges: function(paramChanges) {
        return paramChanges.map(function(paramChange) {
          return paramChange.toBackendDict();
        });
      },
      paramSpecs: function(paramSpecs) {
        return paramSpecs.toBackendDict();
      },
      solution: function(solution) {
        if (solution) {
          return solution.toBackendDict();
        } else {
          return null;
        }
      },
      writtenTranslations: function(writtenTranslations) {
        return writtenTranslations.toBackendDict();
      }
    };

    // Maps backend names to the corresponding frontend dict accessor lists.
    var PROPERTY_REF_DATA = {
      answerGroups: ['interaction', 'answerGroups'],
      confirmedUnclassifiedAnswers: [
        'interaction', 'confirmedUnclassifiedAnswers'],
      content: ['content'],
      recordedVoiceovers: ['recordedVoiceovers'],
      defaultOutcome: ['interaction', 'defaultOutcome'],
      paramChanges: ['paramChanges'],
      paramSpecs: ['paramSpecs'],
      hints: ['interaction', 'hints'],
      solicitAnswerDetails: ['solicitAnswerDetails'],
      solution: ['interaction', 'solution'],
      widgetId: ['interaction', 'id'],
      widgetCustomizationArgs: ['interaction', 'customizationArgs'],
      writtenTranslations: ['writtenTranslations']
    };

    var CONTENT_ID_EXTRACTORS = {
      answerGroups: function(answerGroups) {
        var contentIds = new Set();
        answerGroups.forEach(function(answerGroup) {
          contentIds.add(answerGroup.outcome.feedback.getContentId());
        });
        return contentIds;
      },
      defaultOutcome: function(defaultOutcome) {
        var contentIds = new Set();
        if (defaultOutcome) {
          contentIds.add(defaultOutcome.feedback.getContentId());
        }
        return contentIds;
      },
      hints: function(hints) {
        var contentIds = new Set();
        hints.forEach(function(hint) {
          contentIds.add(hint.hintContent.getContentId());
        });
        return contentIds;
      },
      solution: function(solution) {
        var contentIds = new Set();
        if (solution) {
          contentIds.add(solution.explanation.getContentId());
        }
        return contentIds;
      }
    };

    var _getElementsInFirstSetButNotInSecond = function(setA, setB) {
      var diffList = Array.from(setA).filter(function(element) {
        return !setB.has(element);
      });
      return diffList;
    };

    var _setState = function(stateName, stateData, refreshGraph) {
      _states.setState(stateName, angular.copy(stateData));
      if (refreshGraph) {
        $rootScope.$broadcast('refreshGraph');
      }
    };

    var getStatePropertyMemento = function(stateName, backendName) {
      var accessorList = PROPERTY_REF_DATA[backendName];
      var propertyRef = _states.getState(stateName);
      try {
        accessorList.forEach(function(key) {
          propertyRef = propertyRef[key];
        });
      } catch (e) {
        var additionalInfo = ('\nUndefined states error debug logs:' +
          '\nRequested state name: ' + stateName +
          '\nExploration ID: ' + ContextService.getExplorationId() +
          '\nChange list: ' + JSON.stringify(
          ChangeListService.getChangeList()) +
          '\nAll states names: ' + _states.getStateNames());
        e.message += additionalInfo;
        throw e;
      }

      return angular.copy(propertyRef);
    };

    var saveStateProperty = function(stateName, backendName, newValue) {
      var oldValue = getStatePropertyMemento(stateName, backendName);
      var newBackendValue = angular.copy(newValue);
      var oldBackendValue = angular.copy(oldValue);

      if (BACKEND_CONVERSIONS.hasOwnProperty(backendName)) {
        newBackendValue = convertToBackendRepresentation(newValue, backendName);
        oldBackendValue = convertToBackendRepresentation(oldValue, backendName);
      }

      if (!angular.equals(oldValue, newValue)) {
        ChangeListService.editStateProperty(
          stateName, backendName, newBackendValue, oldBackendValue);

        var newStateData = _states.getState(stateName);
        var accessorList = PROPERTY_REF_DATA[backendName];

        if (CONTENT_ID_EXTRACTORS.hasOwnProperty(backendName)) {
          var oldContentIds = CONTENT_ID_EXTRACTORS[backendName](oldValue);
          var newContentIds = CONTENT_ID_EXTRACTORS[backendName](newValue);
          var contentIdsToDelete = _getElementsInFirstSetButNotInSecond(
            oldContentIds, newContentIds);
          var contentIdsToAdd = _getElementsInFirstSetButNotInSecond(
            newContentIds, oldContentIds);
          contentIdsToDelete.forEach(function(contentId) {
            newStateData.recordedVoiceovers.deleteContentId(contentId);
            newStateData.writtenTranslations.deleteContentId(contentId);
          });
          contentIdsToAdd.forEach(function(contentId) {
            newStateData.recordedVoiceovers.addContentId(contentId);
            newStateData.writtenTranslations.addContentId(contentId);
          });
        }
        var propertyRef = newStateData;
        for (var i = 0; i < accessorList.length - 1; i++) {
          propertyRef = propertyRef[accessorList[i]];
        }

        propertyRef[accessorList[accessorList.length - 1]] = angular.copy(
          newValue);

        // We do not refresh the state editor immediately after the interaction
        // id alone is saved, because the customization args dict will be
        // temporarily invalid. A change in interaction id will always entail
        // a change in the customization args dict anyway, so the graph will
        // get refreshed after both properties have been updated.
        var refreshGraph = (backendName !== 'widget_id');
        _setState(stateName, newStateData, refreshGraph);
      }
    };

    var convertToBackendRepresentation = function(frontendValue, backendName) {
      var conversionFunction = BACKEND_CONVERSIONS[backendName];
      return conversionFunction(frontendValue);
    };

    // TODO(sll): Add unit tests for all get/save methods.
    return {
      init: function(statesBackendDict) {
        _states = StatesObjectFactory.createFromBackendDict(statesBackendDict);
        // Initialize the solutionValidityService.
        SolutionValidityService.init(_states.getStateNames());
        _states.getStateNames().forEach(function(stateName) {
          var solution = _states.getState(stateName).interaction.solution;
          if (solution) {
            var result = (
              AnswerClassificationService.getMatchingClassificationResult(
                stateName,
                _states.getState(stateName).interaction,
                solution.correctAnswer,
                $injector.get(
                  AngularNameService.getNameOfInteractionRulesService(
                    _states.getState(stateName).interaction.id))));
            var solutionIsValid = stateName !== result.outcome.dest;
            SolutionValidityService.updateValidity(
              stateName, solutionIsValid);
          }
        });
      },
      getStates: function() {
        return angular.copy(_states);
      },
      getStateNames: function() {
        return _states.getStateNames();
      },
      hasState: function(stateName) {
        return _states.hasState(stateName);
      },
      getState: function(stateName) {
        return angular.copy(_states.getState(stateName));
      },
      setState: function(stateName, stateData) {
        _setState(stateName, stateData, true);
      },
      isNewStateNameValid: function(newStateName, showWarnings) {
        if (_states.hasState(newStateName)) {
          if (showWarnings) {
            AlertsService.addWarning('A state with this name already exists.');
          }
          return false;
        }
        return (
          ValidatorsService.isValidStateName(newStateName, showWarnings));
      },
      getStateContentMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'content');
      },
      saveStateContent: function(stateName, newContent) {
        saveStateProperty(stateName, 'content', newContent);
      },
      getStateParamChangesMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'paramChanges');
      },
      saveStateParamChanges: function(stateName, newParamChanges) {
        saveStateProperty(stateName, 'paramChanges', newParamChanges);
      },
      getInteractionIdMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'widgetId');
      },
      saveInteractionId: function(stateName, newInteractionId) {
        saveStateProperty(stateName, 'widgetId', newInteractionId);
        stateInteractionSavedCallbacks.forEach(function(callback) {
          callback(stateName);
        });
      },
      getInteractionCustomizationArgsMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'widgetCustomizationArgs');
      },
      saveInteractionCustomizationArgs: function(
          stateName, newCustomizationArgs) {
        saveStateProperty(
          stateName, 'widgetCustomizationArgs', newCustomizationArgs);
        stateInteractionSavedCallbacks.forEach(function(callback) {
          callback(stateName);
        });
      },
      getInteractionAnswerGroupsMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'answerGroups');
      },
      saveInteractionAnswerGroups: function(stateName, newAnswerGroups) {
        saveStateProperty(stateName, 'answerGroups', newAnswerGroups);
        stateInteractionSavedCallbacks.forEach(function(callback) {
          callback(stateName);
        });
      },
      getConfirmedUnclassifiedAnswersMemento: function(stateName) {
        return getStatePropertyMemento(
          stateName, 'confirmedUnclassifiedAnswers');
      },
      saveConfirmedUnclassifiedAnswers: function(stateName, newAnswers) {
        saveStateProperty(
          stateName, 'confirmedUnclassifiedAnswers', newAnswers);
        stateInteractionSavedCallbacks.forEach(function(callback) {
          callback(stateName);
        });
      },
      getInteractionDefaultOutcomeMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'defaultOutcome');
      },
      saveInteractionDefaultOutcome: function(stateName, newDefaultOutcome) {
        saveStateProperty(stateName, 'defaultOutcome', newDefaultOutcome);
      },
      getHintsMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'hints');
      },
      saveHints: function(stateName, newHints) {
        saveStateProperty(stateName, 'hints', newHints);
      },
      getSolutionMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'solution');
      },
      saveSolution: function(stateName, newSolution) {
        saveStateProperty(stateName, 'solution', newSolution);
      },
      getRecordedVoiceoversMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'recordedVoiceovers');
      },
      saveRecordedVoiceovers: function(stateName, newRecordedVoiceovers) {
        saveStateProperty(
          stateName, 'recordedVoiceovers', newRecordedVoiceovers);
      },
      getSolicitAnswerDetailsMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'solicitAnswerDetails');
      },
      saveSolicitAnswerDetails: function(stateName, newSolicitAnswerDetails) {
        saveStateProperty(
          stateName, 'solicitAnswerDetails', newSolicitAnswerDetails);
      },
      getWrittenTranslationsMemento: function(stateName) {
        return getStatePropertyMemento(stateName, 'writtenTranslations');
      },
      saveWrittenTranslations: function(stateName, newWrittenTranslations) {
        saveStateProperty(
          stateName, 'writtenTranslations', newWrittenTranslations);
      },
      isInitialized: function() {
        return _states !== null;
      },
      addState: function(newStateName, successCallback) {
        newStateName = $filter('normalizeWhitespace')(newStateName);
        if (!ValidatorsService.isValidStateName(newStateName, true)) {
          return;
        }
        if (_states.hasState(newStateName)) {
          AlertsService.addWarning('A state with this name already exists.');
          return;
        }
        AlertsService.clearWarnings();

        _states.addState(newStateName);

        ChangeListService.addState(newStateName);
        stateAddedCallbacks.forEach(function(callback) {
          callback(newStateName);
        });
        $rootScope.$broadcast('refreshGraph');
        if (successCallback) {
          successCallback(newStateName);
        }
      },
      deleteState: function(deleteStateName) {
        AlertsService.clearWarnings();

        var initStateName = ExplorationInitStateNameService.displayed;
        if (deleteStateName === initStateName) {
          return $q.reject('The initial state can not be deleted.');
        }
        if (!_states.hasState(deleteStateName)) {
          var message = 'No state with name ' + deleteStateName + ' exists.';
          AlertsService.addWarning(message);
          return $q.reject(message);
        }

        return $uibModal.open({
          templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
            '/pages/exploration-editor-page/editor-tab/templates/' +
            'modal-templates/confirm-delete-state-modal.template.html'),
          backdrop: true,
          controller: [
            '$controller', '$scope', '$uibModalInstance',
            function($controller, $scope, $uibModalInstance) {
              $controller('ConfirmOrCancelModalController', {
                $scope: $scope,
                $uibModalInstance: $uibModalInstance
              });
              $scope.deleteStateWarningText = (
                'Are you sure you want to delete the card "' +
                deleteStateName + '"?');
            }
          ]
        }).result.then(function() {
          _states.deleteState(deleteStateName);

          ChangeListService.deleteState(deleteStateName);

          if (StateEditorService.getActiveStateName() === deleteStateName) {
            StateEditorService.setActiveStateName(
              ExplorationInitStateNameService.savedMemento);
          }

          stateDeletedCallbacks.forEach(function(callback) {
            callback(deleteStateName);
          });
          $location.path('/gui/' + StateEditorService.getActiveStateName());
          $rootScope.$broadcast('refreshGraph');
          // This ensures that if the deletion changes rules in the current
          // state, they get updated in the view.
          $rootScope.$broadcast('refreshStateEditor');
        }, function() {
          AlertsService.clearWarnings();
        });
      },
      renameState: function(oldStateName, newStateName) {
        newStateName = $filter('normalizeWhitespace')(newStateName);
        if (!ValidatorsService.isValidStateName(newStateName, true)) {
          return;
        }
        if (_states.hasState(newStateName)) {
          AlertsService.addWarning('A state with this name already exists.');
          return;
        }
        AlertsService.clearWarnings();

        _states.renameState(oldStateName, newStateName);

        StateEditorService.setActiveStateName(newStateName);
        StateEditorService.setStateNames(_states.getStateNames());
        // The 'rename state' command must come before the 'change
        // init_state_name' command in the change list, otherwise the backend
        // will raise an error because the new initial state name does not
        // exist.
        ChangeListService.renameState(newStateName, oldStateName);
        SolutionValidityService.onRenameState(newStateName, oldStateName);
        // Amend initStateName appropriately, if necessary. Note that this
        // must come after the state renaming, otherwise saving will lead to
        // a complaint that the new name is not a valid state name.
        if (ExplorationInitStateNameService.displayed === oldStateName) {
          ExplorationInitStateNameService.displayed = newStateName;
          ExplorationInitStateNameService.saveDisplayedValue(newStateName);
        }
        stateRenamedCallbacks.forEach(function(callback) {
          callback(oldStateName, newStateName);
        });
        $rootScope.$broadcast('refreshGraph');
      },
      registerOnStateAddedCallback: function(callback) {
        stateAddedCallbacks.push(callback);
      },
      registerOnStateDeletedCallback: function(callback) {
        stateDeletedCallbacks.push(callback);
      },
      registerOnStateRenamedCallback: function(callback) {
        stateRenamedCallbacks.push(callback);
      },
      registerOnStateInteractionSavedCallback: function(callback) {
        stateInteractionSavedCallbacks.push(callback);
      }
    };
  }
]);
