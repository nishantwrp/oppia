
// Copyright 2017 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS-IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for the extracting image files in state service.
 */

import { TestBed } from '@angular/core/testing';

import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { ContextService } from 'services/context.service';
import { ExplorationObjectFactory } from
  'domain/exploration/ExplorationObjectFactory';
import { ExtractImageFilenamesFromStateService } from
  // eslint-disable-next-line max-len
  'pages/exploration-player-page/services/extract-image-filenames-from-state.service';


describe('Extracting Image file names in the state service', () => {
  let eifss: ExtractImageFilenamesFromStateService;
  let eof: ExplorationObjectFactory;
  let ecs: ContextService;
  let explorationDict;
  let ImageFilenamesInExploration;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamelCaseToHyphensPipe]
    });
    eof = TestBed.get(ExplorationObjectFactory);
    ecs = TestBed.get(ContextService);
    eifss = TestBed.get(ExtractImageFilenamesFromStateService);
    spyOn(ecs, 'getExplorationId').and.returnValue('1');

    explorationDict = {
      id: 1,
      title: 'My Title',
      category: 'Art',
      objective: 'Your objective',
      tags: [],
      blurb: '',
      authorNotes: '',
      statesSchemaVersion: 15,
      initStateName: 'Introduction',
      states: {
        'State 1': {
          paramChanges: [],
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
            id: 'Continue',
            defaultOutcome: {
              feedback: {
                contentId: 'default_outcome',
                html: ''
              },
              dest: 'State 3',
              paramChanges: []
            },
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {
              buttonText: {
                value: 'Continue'
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
        },
        'State 3': {
          paramChanges: [],
          content: {
            contentId: 'content',
            html: 'Congratulations, you have finished!'
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
        },
        Introduction: {
          classifierModelId: null,
          paramChanges: [],
          content: {
            contentId: 'content',
            html: 'Multiple Choice'
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {}
            }
          },
          interaction: {
            id: 'MultipleChoiceInput',
            defaultOutcome: {
              dest: 'Introduction',
              feedback: {
                contentId: 'default_outcome',
                html: 'Try Again!'
              }
            },
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {
              choices: {
                value: [
                  '<p> Go to ItemSelection <oppia-noninteractive-image' +
                  ' filepath-with-value="&amp;quot;sIMultipleChoice1.png&amp;' +
                  'quot;"></oppia-noninteractive-image></p>',
                  '<p> Go to ImageAndRegion<oppia-noninteractive-image' +
                  ' filepath-with-value="&amp;quot;sIMultipleChoice2.png&amp;' +
                  'quot;"></oppia-noninteractive-image></p>'
                ]
              }
            },
            answerGroups: [
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 4',
                  feedback: {
                    contentId: 'feedback_1',
                    html: '<p>We are going to ItemSelection' +
                          '<oppia-noninteractive-image filepath-with-value=' +
                          '"&amp;quot;sIOutcomeFeedback.png&amp;quot;">' +
                          '</oppia-noninteractive-image></p>'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [
                  {
                    inputs: {
                      x: 0
                    },
                    ruleType: 'Equals'
                  }
                ]
              },
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 5',
                  feedback: {
                    contentId: 'feedback_2',
                    html: "Let's go to state 5 ImageAndRegion"
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [
                  {
                    inputs: {
                      x: 1
                    },
                    ruleType: 'Equals'
                  }
                ]
              }
            ],
            hints: [],
            solution: null
          },
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {}
            }
          }
        },
        'State 4': {
          paramChanges: [],
          content: {
            contentId: 'content',
            html: '<p><oppia-noninteractive-image filepath-with-value="&amp;' +
                  'quot;s4Content.png&amp;quot;">' +
                  '</oppia-noninteractive-image></p>'
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {}
            }
          },
          interaction: {
            id: 'ItemSelectionInput',
            defaultOutcome: {
              feedback: {
                contentId: 'content',
                html: '<p>Try Again! <oppia-noninteractive-image' +
                      'filepath-with-value="&amp;quot;' +
                      's4DefaultOutcomeFeedback.png&amp;quot;">' +
                      '</oppia-noninteractive-image></p>'
              },
              dest: 'State 4',
              paramChanges: []
            },
            confirmedUnclassifiesAnswers: [],
            customizationArgs: {
              minAllowableSelectionCount: {
                value: 1
              },
              maxAllowableSelectionCount: {
                value: 2
              },
              choices: {
                value: [
                  '<p><oppia-noninteractive-image filepath-with-value="&amp;' +
                  'quot;s4Choice1.png&amp;quot;">' +
                  '</oppia-noninteractive-image></p>',
                  '<p><oppia-noninteractive-image filepath-with-value="&amp;' +
                  'quot;s4Choice2.png&amp;quot;">' +
                  '</oppia-noninteractive-image></p>']
              }
            },
            hints: [],
            solution: null,
            answerGroups: [
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 6',
                  feedback: {
                    contentId: 'feedback_1',
                    html: "It is choice number 1. Let's go to the Text Input"
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [
                  {
                    inputs: {
                      x: [
                        '<p><oppia-noninteractive-image filepath-with-value=' +
                        '"&amp;quot;s4Choice1.png&amp;quot;">' +
                        '</oppia-noninteractive-image></p>'
                      ]
                    },
                    ruleType: 'Equals'
                  }
                ]
              },
              {
                labelledAsCorrect: true,
                outcome: {
                  dest: 'State 1',
                  feedback: {
                    contentId: 'feedback_2',
                    html: 'It is choice number 2'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [
                  {
                    inputs: {
                      x: [
                        '<p><oppia-noninteractive-image filepath-with-value=' +
                        '"&amp;quot;s4Choice2.png&amp;quot;">' +
                        '</oppia-noninteractive-image></p>'
                      ]
                    },
                    ruleType: 'Equals'
                  }
                ]
              }
            ]
          },
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {}
            }
          }
        },
        'State 5': {
          classifierModelId: null,
          paramChanges: [],
          content: {
            contentId: 'content',
            html: ''
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {},
              feedback3: {},
              feedback4: {},
              feedback5: {}
            }
          },
          interaction: {
            id: 'ImageClickInput',
            confirmedUnclassifiedAnswers: [],
            defaultOutcome: {
              dest: 'State 5',
              feedback: {
                contentId: 'content',
                html: 'Try Again!'
              }
            },
            answerGroups: [
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 5',
                  feedback: {
                    contentId: 'feeedback_1',
                    html: '<p>That is the class definition. Try again.</p>'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [{
                  inputs: {
                    x: 'classdef'
                  },
                  ruleType: 'IsInRegion'
                }]
              },
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 5',
                  feedback: {
                    contentId: 'feeedback_2',
                    html: '<p>That is a function, which is close to what you' +
                          'are looking for. Try again!</p>'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [{
                  inputs: {
                    x: 'instancefunc'
                  },
                  ruleType: 'IsInRegion'
                }]
              },
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 5',
                  feedback: {
                    contentId: 'feeedback_3',
                    html: '<p>That is the class docstring. Try again.</p>'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [{
                  inputs: {
                    x: 'docstring'
                  },
                  ruleType: 'IsInRegion'
                }]
              },
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 5',
                  feedback: {
                    contentId: 'feeedback_4',
                    html: "<p>That's a classmethod. It does execute code," +
                          "but it doesn't construct anything. Try again!</p>"
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [{
                  inputs: {
                    x: 'classfunc'
                  },
                  ruleType: 'IsInRegion'
                }]
              },
              {
                labelledAsCorrect: false,
                outcome: {
                  dest: 'State 1',
                  feedback: {
                    contentId: 'feeedback_5',
                    html: '<p>You found it! This is the code responsible for' +
                          'constructing a new class object.</p>'
                  },
                  paramChanges: [],
                  refresherExplorationId: null
                },
                ruleSpecs: [{
                  inputs: {
                    x: 'ctor'
                  },
                  ruleType: 'IsInRegion'
                }]
              }
            ],
            customizationArgs: {
              highlightRegionsOnHover: {
                value: true
              },
              imageAndRegions: {
                value: {
                  imagePath: 's5ImagePath.png',
                  labeledRegions: [{
                    label: 'classdef',
                    region: {
                      area: [
                        [0.004291845493562232, 0.004692192192192192],
                        [0.40987124463519314, 0.05874624624624625]
                      ],
                      regionType: 'Rectangle'
                    }
                  },
                  {
                    label: 'docstring',
                    region: {
                      area: [
                        [0.07296137339055794, 0.06475225225225226],
                        [0.9892703862660944, 0.1218093093093093]
                      ],
                      regionType: 'Rectangle'
                    }
                  },
                  {
                    label: 'instancefunc',
                    region: {
                      area: [
                        [0.07296137339055794, 0.15183933933933935],
                        [0.6995708154506438, 0.44012762762762764]
                      ],
                      regionType: 'Rectangle'
                    }
                  },
                  {
                    label: 'classfunc',
                    region: {
                      area: [
                        [0.06866952789699571, 0.46114864864864863],
                        [0.6931330472103004, 0.776463963963964]
                      ],
                      regionType: 'Rectangle'
                    }
                  },
                  {
                    label: 'ctor',
                    region: {
                      area: [
                        [0.06437768240343347, 0.821509009009009],
                        [0.740343347639485, 0.9926801801801802]
                      ],
                      regionType: 'Rectangle'
                    }
                  }]
                }
              }
            },
            hints: [],
            solution: null
          },
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {},
              feedback3: {},
              feedback4: {},
              feedback5: {}
            }
          }
        },
        'State 6': {
          paramChanges: [],
          content: {
            contentId: 'content',
            html: '<p>Text Input Content</p>'
          },
          recordedVoiceovers: {
            voiceoversMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {},
              hint1: {},
              solution: {}
            }
          },
          interaction: {
            id: 'TextInput',
            defaultOutcome: {
              dest: 'State 6',
              feedback: {
                contentId: 'default_outcome',
                html: '<p>Try again.</p>'
              },
              labelledAsCorrect: false,
              paramChanges: [],
              refresherExplorationId: null
            },
            confirmedUnclassifiedAnswers: [],
            customizationArgs: {
              rows: {
                value: 1
              },
              placeholder: {
                value: ''
              }
            },
            answerGroups: [{
              ruleSpecs: [{
                inputs: {
                  x: '1'
                },
                ruleType: 'Contains'
              }],
              outcome: {
                dest: 'State 1',
                feedback: {
                  contentId: 'feedback_1',
                  html: "<p>Let's go to State 1</p>"
                },
                labelledAsCorrect: false,
                paramChanges: [],
                refresherExplorationId: null
              }
            }, {
              ruleSpecs: [{
                inputs: {
                  x: '2'
                },
                ruleType: 'Contains'
              }],
              outcome: {
                dest: 'State 1',
                feedback: {
                  contentId: 'feedback_2',
                  html: "<p>Let's go to State 1</p>"
                },
                labelledAsCorrect: false,
                paramChanges: [],
                refresherExplorationId: null
              }
            }],
            hints: [{
              hintContent: {
                contentId: 'hint_1',
                html: '<p><oppia-noninteractive-image filepath-with-value="' +
                      '&amp;quot;s6Hint1.png&amp;quot;">' +
                      '</oppia-noninteractive-image></p>'
              }
            }],
            solution: {
              answerIsExclusive: false,
              correctAnswer: 'cat',
              explanation: {
                contentId: 'solution',
                html: '<p><oppia-noninteractive-image filepath-with-value="' +
                      '&amp;quot;s6SolutionExplanation.png&amp;quot;">' +
                      '</oppia-noninteractive-image></p>'
              }
            },
          },
          solicitAnswerDetails: false,
          writtenTranslations: {
            translationsMapping: {
              content: {},
              defaultOutcome: {},
              feedback1: {},
              feedback2: {},
              hint1: {},
              solution: {}
            }
          },
          classifierModelId: null
        }
      },
      paramSpecs: {},
      paramChanges: [],
      version: 1
    };

    ImageFilenamesInExploration = {
      'State 1': [],
      'State 3': [],
      'State 4': ['s4Content.png', 's4Choice1.png', 's4Choice2.png',
        's4DefaultOutcomeFeedback.png'],
      'State 5': ['s5ImagePath.png'],
      'State 6': ['s6Hint1.png', 's6SolutionExplanation.png'],
      Introduction: ['sIMultipleChoice1.png', 'sIMultipleChoice2.png',
        'sIOutcomeFeedback.png']
    };
  });

  it('should get all the filenames of the images in a state',
    () => {
      let exploration = eof.createFromBackendDict(explorationDict);
      let states = exploration.getStates();
      let stateNames = states.getStateNames();
      stateNames.forEach((statename) => {
        let filenamesInState = (
          eifss.getImageFilenamesInState(states.getState(statename)));
        filenamesInState.forEach(function(filename) {
          expect(ImageFilenamesInExploration[statename]).toContain(filename);
        });
      });
    });
});
