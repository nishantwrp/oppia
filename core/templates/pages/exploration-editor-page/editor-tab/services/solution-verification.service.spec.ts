// Copyright 2017 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for Solution Verification Service.
 */

// TODO(#7222): Remove the following block of unnnecessary imports once
// the code corresponding to the spec is upgraded to Angular 8.
import { UpgradedServices } from 'services/UpgradedServices';
// ^^^ This block is to be removed.

import { AngularNameService } from
  'pages/exploration-editor-page/services/angular-name.service';

require('App.ts');
require('domain/exploration/SolutionObjectFactory.ts');
require('pages/exploration-editor-page/services/exploration-states.service.ts');
require(
  'pages/exploration-editor-page/editor-tab/services/' +
  'solution-verification.service.ts');
require(
  'components/state-editor/state-editor-properties-services/' +
  'state-customization-args.service.ts');
require(
  'components/state-editor/state-editor-properties-services/' +
  'state-editor.service.ts');
require(
  'components/state-editor/state-editor-properties-services/' +
  'state-interaction-id.service.ts');

describe('Solution Verification Service', function() {
  var ess, siis, scas, sof, svs, see;
  var mockExplorationData;

  beforeEach(angular.mock.module('oppia'));
  beforeEach(angular.mock.module('oppia', function($provide) {
    $provide.value('AngularNameService', new AngularNameService());
    $provide.constant('INTERACTION_SPECS', {
      TextInput: {
        display_mode: 'inline',
        is_terminal: false
      },
      TerminalInteraction: {
        display_mode: 'inline',
        is_terminal: true
      }
    });
  }));
  beforeEach(angular.mock.module('oppia', function($provide) {
    var ugs = new UpgradedServices();
    for (let [key, value] of Object.entries(ugs.getUpgradedServices())) {
      $provide.value(key, value);
    }
  }));
  beforeEach(function() {
    mockExplorationData = {
      explorationId: 0,
      autosaveChangeList: function() {}
    };
    angular.mock.module(function($provide) {
      $provide.value('ExplorationDataService', [mockExplorationData][0]);
    });
    spyOn(mockExplorationData, 'autosaveChangeList');
  });

  beforeEach(angular.mock.inject(function($injector) {
    ess = $injector.get('ExplorationStatesService');
    siis = $injector.get('StateInteractionIdService');
    scas = $injector.get('StateCustomizationArgsService');
    sof = $injector.get('SolutionObjectFactory');
    see = $injector.get('StateEditorService');
    svs = $injector.get('SolutionVerificationService');

    ess.init({
      'First State': {
        content: {
          contentId: 'content',
          html: 'First State Content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {},
            hint1: {},
            hint2: {}
          }
        },
        interaction: {
          id: 'TextInput',
          answerGroups: [{
            outcome: {
              dest: 'End State',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {x: 'abc'},
              ruleType: 'Contains'
            }]
          }],
          defaultOutcome: {
            dest: 'First State',
            feedback: {
              contentId: 'default_outcome',
              html: ''
            },
            labelledAsCorrect: false,
            paramChanges: [],
            refresherExplorationId: null
          },
          hints: [{
            hintContent: {
              contentId: 'hint_1',
              html: 'one'
            }
          }, {
            hintContent: {
              contentId: 'hint_2',
              html: 'two'
            }
          }]
        },
        paramChanges: [],
        solicitAnswerDetails: false,
        writtenTranslations: {
          translationsMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {},
            hint1: {},
            hint2: {}
          }
        }
      },
      'End State': {
        content: {
          contentId: 'content',
          html: ''
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'TextInput',
          answerGroups: [{
            ruleSpecs: [],
            outcome: {
              dest: 'default',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            }
          }],
          defaultOutcome: {
            dest: 'default',
            feedback: {
              contentId: 'default_outcome',
              html: ''
            },
            paramChanges: []
          },
          hints: []
        },
        paramChanges: [],
        solicitAnswerDetails: false,
        writtenTranslations: {
          translationsMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        }
      }
    });
  }));

  it('should verify a correct solution', function() {
    var state = ess.getState('First State');
    siis.init(
      'First State', state.interaction.id, state.interaction, 'widgetId');
    scas.init(
      'First State', state.interaction.customizationArgs,
      state.interaction, 'widgetCustomizationArgs');

    siis.savedMemento = 'TextInput';
    ess.saveSolution('First State', sof.createNew(false, 'abc', 'nothing'));

    expect(
      svs.verifySolution('First State', state.interaction,
        ess.getState('First State').interaction.solution.correctAnswer)
    ).toBe(true);

    see.setInQuestionMode(true);
    state.interaction.answerGroups[0].outcome.dest = 'First State';
    state.interaction.answerGroups[0].outcome.labelledAsCorrect = true;
    expect(
      svs.verifySolution('First State', state.interaction,
        ess.getState('First State').interaction.solution.correctAnswer)
    ).toBe(true);
  });

  it('should verify an incorrect solution', function() {
    var state = ess.getState('First State');
    siis.init(
      'First State', state.interaction.id, state.interaction, 'widgetid');
    scas.init(
      'First State', state.interaction.customizationArgs,
      state.interaction, 'widgetCustomizationArgs');

    siis.savedMemento = 'TextInput';
    ess.saveSolution('First State', sof.createNew(false, 'xyz', 'nothing'));

    expect(
      svs.verifySolution('First State', state.interaction,
        ess.getState('First State').interaction.solution.correctAnswer)
    ).toBe(false);
  });
});
