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
 * @fileoverview Unit tests for StateObjectFactory.
 */
import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { StateObjectFactory } from 'domain/state/StateObjectFactory';
import { TestBed } from '@angular/core/testing';
import { SubtitledHtmlObjectFactory } from
  'domain/exploration/SubtitledHtmlObjectFactory';
import { InteractionObjectFactory } from
  'domain/exploration/InteractionObjectFactory';
import { ParamChangesObjectFactory } from
  'domain/exploration/ParamChangesObjectFactory';
import { RecordedVoiceoversObjectFactory } from
  'domain/exploration/RecordedVoiceoversObjectFactory';
import { WrittenTranslationsObjectFactory } from
  'domain/exploration/WrittenTranslationsObjectFactory';

const constants = require('constants.ts');

describe('State Object Factory', () => {
  let sof, shof, iof, pcof, rvof, wtof;
  let stateObject;
  const oldNewStateTemplate = constants.NEW_STATE_TEMPLATE;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamelCaseToHyphensPipe]
    });
    sof = TestBed.get(StateObjectFactory);
    shof = TestBed.get(SubtitledHtmlObjectFactory);
    iof = TestBed.get(InteractionObjectFactory);
    pcof = TestBed.get(ParamChangesObjectFactory);
    rvof = TestBed.get(RecordedVoiceoversObjectFactory);
    wtof = TestBed.get(WrittenTranslationsObjectFactory);

    stateObject = {
      classifierModelId: null,
      content: {
        html: '',
        contentId: 'content'
      },
      interaction: {
        id: 'TextInput',
        customizationArgs: {
          rows: {
            value: 1
          },
          placeholder: {
            value: 'Type your answer here.'
          }
        },
        answerGroups: [],
        defaultOutcome: {
          dest: 'Introduction',
          feedback: {
            contentId: 'default_outcome',
            html: ''
          },
          labelledAsCorrect: false,
          paramChanges: [],
          refresherExplorationId: null,
          missingPrerequisiteSkillId: null
        },
        confirmedUnclassifiedAnswers: [],
        hints: [],
        solution: null
      },
      paramChanges: [],
      recordedVoiceovers: {
        voiceoversMapping: {
          content: {},
          defaultOutcome: {}
        }
      },
      solicitAnswerDetails: false,
      writtenTranslations: {
        translationsMapping: {
          content: {},
          defaultOutcome: {}
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

  it('should create a new state object from backend dict', () => {
    const stateObjectBackend = sof.createFromBackendDict(
      'State name', stateObject);
    expect(stateObjectBackend.toBackendDict()).toEqual(stateObject);
  });

  it('should correctly create a state object when param_changes length ' +
    'is greater than 0', () => {
    const paramChanges = [{
      customizationArgs: {
        parseWithJinja: false,
        value: '10'
      },
      generatorId: 'Copier',
      name: 'Param change 1',
    }];
    stateObject.paramChanges = paramChanges;
    const stateObjectBackend = sof.createFromBackendDict(
      'State name', stateObject);

    expect(stateObjectBackend.toBackendDict()).toEqual({
      ...stateObject,
      // Overrides the param_changes from stateObject
      paramChanges: paramChanges
    });
  });

  it('should create a default state object', () => {
    const stateName = 'Default state';
    const stateObjectDefault = sof.createDefaultState(stateName);
    stateObject.interaction.defaultOutcome.dest = stateName;

    expect(stateObjectDefault.toBackendDict()).toEqual(stateObject);
  });

  it('should set a new name for state object', () => {
    const stateName = 'New name';
    const stateObjectDefault = sof.createFromBackendDict(
      'Default state', stateObject);

    stateObjectDefault.setName(stateName);
    expect(stateObjectDefault.name).toBe(stateName);
  });

  it('should copy a state object', () => {
    const otherState = sof.createFromBackendDict('Other state', stateObject);
    const stateObjectDefault = sof.createFromBackendDict('', stateObject);

    stateObjectDefault.copy(otherState);

    expect(stateObjectDefault).toEqual(otherState);
    expect(stateObjectDefault.name).toEqual('Other state');
  });
});
