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
 * @fileoverview Unit tests for Interaction object factory.
 */

import { TestBed } from '@angular/core/testing';

import { AnswerGroupObjectFactory } from
  'domain/exploration/AnswerGroupObjectFactory';
import { CamelCaseToHyphensPipe } from
  'filters/string-utility-filters/camel-case-to-hyphens.pipe';
import { HintObjectFactory } from 'domain/exploration/HintObjectFactory';
import { InteractionObjectFactory } from
  'domain/exploration/InteractionObjectFactory';
import { OutcomeObjectFactory } from
  'domain/exploration/OutcomeObjectFactory';
import { SolutionObjectFactory } from
  'domain/exploration/SolutionObjectFactory';

describe('Interaction object factory', () => {
  let iof = null;
  let oof = null;
  let agof = null;
  let hof = null;
  let sof = null;
  let answerGroupsDict = null;
  let defaultOutcomeDict = null;
  let solutionDict = null;
  let hintsDict = null;
  let interactionDict = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CamelCaseToHyphensPipe]
    });
    iof = TestBed.get(InteractionObjectFactory);
    oof = TestBed.get(OutcomeObjectFactory);
    agof = TestBed.get(AnswerGroupObjectFactory);
    hof = TestBed.get(HintObjectFactory);
    sof = TestBed.get(SolutionObjectFactory);
    defaultOutcomeDict = {
      dest: 'dest_default',
      feedback: {
        contentId: 'default_outcome',
        html: ''
      },
      labelledAsCorrect: false,
      paramChanges: [],
      refresherExplorationId: null,
      missingPrerequisiteSkillId: null
    };
    answerGroupsDict = [{
      ruleSpecs: [],
      outcome: {
        dest: 'dest_1',
        feedback: {
          contentId: 'outcome_1',
          html: ''
        },
        labelledAsCorrect: false,
        paramChanges: [],
        refresherExplorationId: null,
        missingPrerequisiteSkillId: null
      },
      trainingData: ['training_data'],
      taggedSkillMisconceptionId: 'skill_id-1'
    }];
    hintsDict = [
      {
        hintContent: {
          html: '<p>First Hint</p>',
          contentId: 'content_id1'
        }
      },
      {
        hintContent: {
          html: '<p>Second Hint</p>',
          contentId: 'content_id2'
        }
      }
    ];

    solutionDict = {
      answerIsExclusive: false,
      correctAnswer: 'This is a correct answer!',
      explanation: {
        contentId: 'solution',
        html: 'This is the explanation to the answer'
      }
    };

    interactionDict = {
      answerGroups: answerGroupsDict,
      confirmedUnclassifiedAnswers: [],
      customizationArgs: {
        customArg: {
          value: 'custom_value'
        }
      },
      defaultOutcome: defaultOutcomeDict,
      hints: hintsDict,
      id: 'interaction_id',
      solution: solutionDict
    };
  });

  it('should create an object when default outcome is null', () => {
    const copyInteractionDict = { ...interactionDict };
    copyInteractionDict.defaultOutcome = null;

    const testInteraction = iof.createFromBackendDict(copyInteractionDict);

    expect(testInteraction.defaultOutcome).toBe(null);
  });

  it('should correctly set the new ID', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    expect(testInteraction.id).toEqual('interaction_id');
    testInteraction.setId('new_interaction_id');
    expect(testInteraction.id).toEqual('new_interaction_id');
  });

  it('should correctly set the new answer group', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    let newAnswerGroup = {
      ruleSpecs: [],
      outcome: {
        dest: 'dest_3',
        feedback: {
          contentId: 'outcome_3',
          html: ''
        },
        labelledAsCorrect: false,
        paramChanges: [],
        refresherExplorationId: null,
        missingPrerequisiteSkillId: null
      },
      trainingData: ['training_data'],
      taggedSkillMisconceptionId: 'skill_id-1'
    };
    expect(testInteraction.answerGroups).toEqual([agof.createFromBackendDict({
      ruleSpecs: [],
      outcome: {
        dest: 'dest_1',
        feedback: {
          contentId: 'outcome_1',
          html: ''
        },
        labelledAsCorrect: false,
        paramChanges: [],
        refresherExplorationId: null,
        missingPrerequisiteSkillId: null
      },
      trainingData: ['training_data'],
      taggedSkillMisconceptionId: 'skill_id-1'
    })]);
    newAnswerGroup = agof.createFromBackendDict(newAnswerGroup);
    testInteraction.setAnswerGroups([newAnswerGroup]);
    expect(testInteraction.answerGroups).toEqual([newAnswerGroup]);
  });

  it('should correctly set the new default outcome', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    const newDefaultOutcomeDict = {
      dest: 'dest_default_new',
      feedback: {
        contentId: 'default_outcome_new',
        html: ''
      },
      labelledAsCorrect: false,
      paramChanges: [],
      refresherExplorationId: null,
      missingPrerequisiteSkillId: null
    };
    const newDefaultOutcome = oof.createFromBackendDict(newDefaultOutcomeDict);
    expect(testInteraction.defaultOutcome).toEqual(
      oof.createFromBackendDict({
        dest: 'dest_default',
        feedback: {
          contentId: 'default_outcome',
          html: ''
        },
        labelledAsCorrect: false,
        paramChanges: [],
        refresherExplorationId: null,
        missingPrerequisiteSkillId: null
      }));
    testInteraction.setDefaultOutcome(newDefaultOutcome);
    expect(testInteraction.defaultOutcome).toEqual(newDefaultOutcome);
  });

  it('should correctly set the new customization args', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    const newCustomizationArgs = {
      customArgNew: {
        value: 'custom_value_new'
      }
    };
    expect(testInteraction.customizationArgs).toEqual({
      customArg: {
        value: 'custom_value'
      }
    });
    testInteraction.setCustomizationArgs(newCustomizationArgs);
    expect(testInteraction.customizationArgs).toEqual(newCustomizationArgs);
  });

  it('should correctly set the new solution', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    const newSolutionDict = {
      answer_is_exclusive: false,
      correct_answer: 'This is a new correct answer!',
      explanation: {
        content_id: 'solution_new',
        html: 'This is the new explanation to the answer'
      }
    };
    const newSolution = sof.createFromBackendDict(newSolutionDict);
    expect(testInteraction.solution).toEqual(
      sof.createFromBackendDict({
        answer_is_exclusive: false,
        correct_answer: 'This is a correct answer!',
        explanation: {
          content_id: 'solution',
          html: 'This is the explanation to the answer'
        }
      }));
    testInteraction.setSolution(newSolution);
    expect(testInteraction.solution).toEqual(newSolution);
  });

  it('should correctly set the new hint', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    const newHintDict = {
      hint_content: {
        html: '<p>New Hint</p>',
        content_id: 'content_id_new'
      }
    };
    const newHint = hof.createFromBackendDict(newHintDict);
    expect(testInteraction.hints).toEqual(hintsDict.map(function(hintDict) {
      return hof.createFromBackendDict(hintDict);
    }));
    testInteraction.setHints([newHint]);
    expect(testInteraction.hints).toEqual([newHint]);
  });

  it('should correctly copy from other interaction', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    const newAnswerGroups = [{
      ruleSpecs: [],
      outcome: {
        dest: 'dest_1_new',
        feedback: {
          contentId: 'outcome_1_new',
          html: ''
        },
        labelledAsCorrect: false,
        paramChanges: [],
        refresherExplorationId: null,
        missingPrerequisiteSkillId: null
      },
      trainingData: ['training_data_new'],
      taggedSkillMisconceptionId: 'skill_id-2'
    }];
    const newDefaultOutcome = {
      dest: 'dest_default_new',
      feedback: {
        contentId: 'default_outcome_new',
        html: ''
      },
      labelledAsCorrect: false,
      paramChanges: [],
      refresherExplorationId: null,
      missingPrerequisiteSkillId: null
    };
    const newHintDict = [
      {
        hintContent: {
          html: '<p>New Hint</p>',
          contentId: 'content_id1_new'
        }
      }
    ];
    const newSolutionDict = {
      answerIsExclusive: false,
      correctAnswer: 'This is a new correct answer!',
      explanation: {
        contentId: 'solution_new',
        html: 'This is the new explanation to the answer'
      }
    };
    const otherInteractionDict = {
      answerGroups: newAnswerGroups,
      confirmedUnclassifiedAnswers: [],
      customizationArgs: {
        customArg: {
          value: 'custom_arg'
        }
      },
      defaultOutcome: newDefaultOutcome,
      hints: newHintDict,
      id: 'interaction_id_new',
      solution: newSolutionDict
    };
    const otherInteraction = iof.createFromBackendDict(otherInteractionDict);
    testInteraction.copy(otherInteraction);
    expect(testInteraction).toEqual(otherInteraction);
    otherInteraction.customizationArgs.customArg.value = 'custom_arg_new';
    expect(testInteraction).toEqual(iof.createFromBackendDict({
      answerGroups: newAnswerGroups,
      confirmedUnclassifiedAnswers: [],
      customizationArgs: {
        customArg: {
          value: 'custom_arg'
        }
      },
      defaultOutcome: newDefaultOutcome,
      hints: newHintDict,
      id: 'interaction_id_new',
      solution: newSolutionDict
    }));
  });

  it('should correctly convert it to backend dict', () => {
    const testInteraction = iof.createFromBackendDict(interactionDict);

    expect(testInteraction.toBackendDict()).toEqual(interactionDict);
  });
});
