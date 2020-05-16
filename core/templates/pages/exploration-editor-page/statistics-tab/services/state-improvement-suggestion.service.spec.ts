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
 * @fileoverview Unit tests for statistics services.
 */

import { TestBed } from '@angular/core/testing';

import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { StateImprovementSuggestionService, StateStats } from
  // eslint-disable-next-line max-len
  'pages/exploration-editor-page/statistics-tab/services/state-improvement-suggestion.service';
import { StatesObjectFactory } from 'domain/exploration/StatesObjectFactory';

describe('StateImprovementSuggestionService', () => {
  // TODO(bhenning): These tests were ported from the backend tests. More tests
  // should be added to make sure getStateImprovements() is thoroughly tested.
  describe('getStateImprovements', () => {
    let IMPROVE_TYPE_INCOMPLETE: string = 'incomplete';
    let siss: StateImprovementSuggestionService;
    let ssof: StatesObjectFactory;

    // A self-looping state.
    var statesDict1 = {
      state: {
        content: {
          contentId: 'content',
          html: 'content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'RuleTest',
          answerGroups: [{
            outcome: {
              dest: 'unused',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }],
          }],
          defaultOutcome: {
            dest: 'state',
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
    };

    // A non-looping state.
    var statesDict2 = {
      initial: {
        content: {
          contentId: 'content',
          html: 'content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'RuleTest',
          answerGroups: [{
            outcome: {
              dest: 'unused',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }]
          }],
          defaultOutcome: {
            dest: 'end',
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
        },
      },
      end: {
        content: {
          contentId: 'content',
          html: 'content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'RuleTest',
          answerGroups: [{
            outcome: {
              dest: 'unused',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }]
          }],
          defaultOutcome: {
            dest: null,
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
        },
      }
    };

    // 2 states that are both self-looping
    var statesDict3 = {
      'State 1': {
        content: {
          contentId: 'content',
          html: 'content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'RuleTest',
          answerGroups: [{
            outcome: {
              dest: 'next state',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }]
          }],
          defaultOutcome: {
            dest: 'State 1',
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
        },
      },
      'State 2': {
        content: {
          contentId: 'content',
          html: 'content'
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {},
            feedback1: {}
          }
        },
        interaction: {
          id: 'RuleTest',
          answerGroups: [{
            outcome: {
              dest: 'next state',
              feedback: {
                contentId: 'feedback_1',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            ruleSpecs: [{
              inputs: {
                x: 10
              },
              ruleType: 'Equals'
            }]
          }],
          defaultOutcome: {
            dest: 'State 2',
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
        },
      }
    };
    interface InteractionType {
      interaction: {
        // eslint-disable-next-line camelcase
        defaultOutcome?: {
          dest: string
        }
      }
    }
    var _createState = (destStateName: string): InteractionType => {
      // Only a partial state definition is needed for these tests.
      if (destStateName) {
        return {
          interaction: {
            defaultOutcome: {
              dest: destStateName
            }
          }
        };
      } else {
        // Create an end state, which has no default_outcome.
        return {
          interaction: { }
        };
      }
    };
    var _createDefaultStateStats = (): StateStats => {
      return {
        total_entry_count: 0,
        no_submitted_answer_count: 0
      };
    };
    var _enterStateWithoutAnswer = (
        stateStats: StateStats): void => {
      stateStats.total_entry_count++;
    };
    var _answerIncorrectly = (stateStats: StateStats): void => {
      stateStats.total_entry_count++;
      stateStats.no_submitted_answer_count++;
    };

    var _answerDefaultOutcome = (stateStats: StateStats): void => {
      stateStats.total_entry_count++;
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [CamelCaseToHyphensPipe]
      });
      siss = TestBed.get(StateImprovementSuggestionService);
      ssof = TestBed.get(StatesObjectFactory);
    });

    it('should not suggest improvements for non-default answers', () => {
      // Create a non-looping state for testing, similar to
      // save_new_valid_exploration.
      var states = ssof.createFromBackendDict(statesDict2);

      // Submit an answer to an answer group rather than the default answer.
      // The end state does not have any relevant stats, either.
      var stateStats = {
        initial: _createDefaultStateStats(),
        end: _createDefaultStateStats()
      };
      _enterStateWithoutAnswer(stateStats.initial);

      // No improvements should be suggested for this situation.
      var improvements = siss.getStateImprovements(states, stateStats);
      expect(improvements).toEqual([]);
    });

    it('should suggest incomplete improvements depending on unsubmitted ' +
       'answer counts', () => {
      // Create a looping state, similar to create_default_exploration.
      var states = ssof.createFromBackendDict(statesDict1);

      // These stats represent failing to answer something twice and hitting the
      // default outcome once.
      var stateStats = {
        state: _createDefaultStateStats(),
      };
      _answerIncorrectly(stateStats.state);
      _answerIncorrectly(stateStats.state);
      _answerDefaultOutcome(stateStats.state);

      // The result should be an improvement recommendation due to the state
      // being potentially confusing.
      var improvements = siss.getStateImprovements(states, stateStats);
      expect(improvements).toEqual([{
        rank: 2,
        stateName: 'state',
        type: IMPROVE_TYPE_INCOMPLETE
      }]);
    });
  });
});
