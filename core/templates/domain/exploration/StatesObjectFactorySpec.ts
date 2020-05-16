// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for the States object factory.
 */

import { TestBed } from '@angular/core/testing';

import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { StateObjectFactory } from 'domain/state/StateObjectFactory';
import { StatesObjectFactory } from 'domain/exploration/StatesObjectFactory';
import { VoiceoverObjectFactory } from
  'domain/exploration/VoiceoverObjectFactory';

const constants = require('constants.ts');

describe('States object factory', () => {
  describe('StatesObjectFactory', () => {
    var scope, sof, ssof, statesDict, statesWithAudioDict, vof;
    const oldNewStateTemplate = constants.NEW_STATE_TEMPLATE;

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [CamelCaseToHyphensPipe]
      });
      ssof = TestBed.get(StatesObjectFactory);
      sof = TestBed.get(StateObjectFactory);
      vof = TestBed.get(VoiceoverObjectFactory);

      statesDict = {
        'first state': {
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
                dest: 'outcome 1',
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
              dest: 'default',
              feedback: {
                contentId: 'default_outcome',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: []
            },
            hints: [],
            solution: null
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

      statesWithAudioDict = {
        'first state': {
          content: {
            contentId: 'content',
            html: 'content'
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {
                en: {
                  filename: 'myfile1.mp3',
                  fileSizeBytes: 0.5,
                  needsUpdate: false,
                  durationSecs: 0.5
                },
                'hi-en': {
                  filename: 'myfile3.mp3',
                  fileSizeBytes: 0.8,
                  needsUpdate: false,
                  durationSecs: 0.8
                }
              },
              defaultOutcome: {
                he: {
                  filename: 'myfile10.mp3',
                  fileSizeBytes: 0.5,
                  needsUpdate: false,
                  durationSecs: 0.5
                }
              },
              feedback1: {
                zh: {
                  filename: 'myfile4.mp3',
                  fileSizeBytes: 1.1,
                  needsUpdate: false,
                  durationSecs: 1.1
                }
              },
              hint1: {
                es: {
                  filename: 'myfile5.mp3',
                  fileSizeBytes: 0.7,
                  needsUpdate: false,
                  durationSecs: 0.7
                },
                zh: {
                  filename: 'myfile6.mp3',
                  fileSizeBytes: 0.9,
                  needsUpdate: false,
                  durationSecs: 0.9
                },
                'hi-en': {
                  filename: 'myfile8.mp3',
                  fileSizeBytes: 1.2,
                  needsUpdate: false,
                  durationSecs: 1.2
                }
              },
              hint2: {
                cs: {
                  filename: 'myfile7.mp3',
                  fileSizeBytes: 0.2,
                  needsUpdate: false,
                  durationSecs: 0.2
                }
              }
            }
          },
          interaction: {
            answerGroups: [{
              outcome: {
                dest: 'second state',
                feedback: {
                  contentId: 'feedback_1',
                  html: '<p>Good.</p>'
                },
                labelledAsCorrect: false,
                paramChanges: [],
                refresherExplorationId: null
              },
              ruleSpecs: [{
                inputs: {
                  x: 20
                },
                ruleType: 'Equals'
              }]
            }],
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {},
            defaultOutcome: {
              dest: 'new state',
              feedback: {
                contentId: 'default_outcome',
                html: '<p>Feedback</p>'
              },
              labelledAsCorrect: false,
              paramChanges: []
            },
            hints: [{
              hintContent: {
                contentId: 'hint_1',
                html: '<p>Here is a hint.</p>'
              }
            }, {
              hintContent: {
                contentId: 'hint_2',
                html: '<p>Here is another hint.</p>'
              }
            }],
            id: 'TextInput'
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
        'second state': {
          content: {
            contentId: 'content',
            html: 'more content'
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {
                'hi-en': {
                  filename: 'myfile2.mp3',
                  fileSizeBytes: 0.8,
                  needsUpdate: false,
                  durationSecs: 0.8
                }
              },
              defaultOutcome: {},
              solution: {
                de: {
                  filename: 'myfile9.mp3',
                  fileSizeBytes: 0.5,
                  needsUpdate: false,
                  durationSecs: 0.5
                }
              }
            }
          },
          interaction: {
            answerGroups: [],
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {},
            defaultOutcome: {
              dest: 'new state',
              feedback: {
                contentId: 'default_outcome',
                html: ''
              },
              labelledAsCorrect: false,
              paramChanges: []
            },
            hints: [],
            solution: {
              answerIsExclusive: false,
              correctAnswer: 'answer',
              explanation: {
                contentId: 'solution',
                html: '<p>This is an explanation.</p>'
              }
            },
            id: 'TextInput'
          },
          paramChanges: [],
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {}
            }
          }
        }
      };
    });

    beforeAll(() => {
      constants.NEW_STATE_TEMPLATE = {
        classifierModelId: null,
        content: {
          contentId: 'content',
          html: ''
        },
        recordedVoiceovers: {
          voiceoversMapping: {
            content: {},
            defaultOutcome: {}
          }
        },
        interaction: {
          answerGroups: [],
          confirmedUnclassifiedAnswers: [],
          customizationArgs: {
            rows: {
              value: 1
            },
            placeholder: {
              value: 'Type your answer here.'
            }
          },
          defaultOutcome: {
            dest: '(untitled state)',
            feedback: {
              contentId: 'default_outcome',
              html: ''
            },
            paramChanges: [],
            labelledAsCorrect: false,
            refresherExplorationId: null,
            missingPrerequisiteSkillId: null
          },
          hints: [],
          solution: null,
          id: 'TextInput'
        },
        paramChanges: [],
        solicitAnswerDetails: false,
        writtenTranslations: {
          translationsMapping: {
            content: {},
            defaultOutcome: {}
          }
        }
      };
    });

    afterAll(() => {
      constants.NEW_STATE_TEMPLATE = oldNewStateTemplate;
    });

    it('should create a new state given a state name', () => {
      var newStates = ssof.createFromBackendDict(statesDict);
      newStates.addState('new state');
      expect(newStates.getState('new state')).toEqual(
        sof.createFromBackendDict('new state', {
          classifierModelId: null,
          content: {
            contentId: 'content',
            html: ''
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {}
            }
          },
          interaction: {
            answerGroups: [],
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {
              rows: {
                value: 1
              },
              placeholder: {
                value: 'Type your answer here.'
              }
            },
            defaultOutcome: {
              dest: 'new state',
              feedback: {
                contentId: 'default_outcome',
                html: ''
              },
              paramChanges: [],
              labelledAsCorrect: false,
              refresherExplorationId: null,
              missingPrerequisiteSkillId: null
            },
            hints: [],
            id: 'TextInput'
          },
          paramChanges: [],
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {}
            }
          },
        }));
    });

    it('should correctly get all audio language codes in states', () => {
      var statesWithAudio = ssof.createFromBackendDict(statesWithAudioDict);
      expect(statesWithAudio.getAllVoiceoverLanguageCodes())
        .toEqual(['en', 'hi-en', 'he', 'zh', 'es', 'cs', 'de']);
    });

    it('should correctly get all audio translations in states', () => {
      var statesWithAudio = ssof.createFromBackendDict(statesWithAudioDict);
      expect(statesWithAudio.getAllVoiceovers('hi-en'))
        .toEqual({
          'first state': [vof.createFromBackendDict({
            filename: 'myfile3.mp3',
            file_size_bytes: 0.8,
            needs_update: false,
            duration_secs: 0.8
          }), vof.createFromBackendDict({
            filename: 'myfile8.mp3',
            file_size_bytes: 1.2,
            needs_update: false,
            duration_secs: 1.2
          })],
          'second state': [vof.createFromBackendDict({
            filename: 'myfile2.mp3',
            file_size_bytes: 0.8,
            needs_update: false,
            duration_secs: 0.8
          })]
        });
    });
  });
});
