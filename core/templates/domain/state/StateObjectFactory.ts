// Copyright 2015 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Factory for creating new frontend instances of State
 * domain objects.
 */
import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { AppConstants } from 'app.constants';
import { InteractionObjectFactory } from
  'domain/exploration/InteractionObjectFactory';
import { ParamChangesObjectFactory } from
  'domain/exploration/ParamChangesObjectFactory';
import { RecordedVoiceoversObjectFactory } from
  'domain/exploration/RecordedVoiceoversObjectFactory';
import { SubtitledHtmlObjectFactory } from
  'domain/exploration/SubtitledHtmlObjectFactory';
import { WrittenTranslationsObjectFactory } from
  'domain/exploration/WrittenTranslationsObjectFactory';

const constants = require('constants.ts');

export class State {
  name;
  classifierModelId;
  content;
  interaction;
  paramChanges;
  recordedVoiceovers;
  solicitAnswerDetails;
  writtenTranslations;
  // TODO(#7165): Replace any with exact type.
  constructor(
      name: string, classifierModelId: any, content: any, interaction: any,
      paramChanges: any, recordedVoiceovers: any, solicitAnswerDetails: any,
      writtenTranslations: any) {
    this.name = name;
    this.classifierModelId = classifierModelId;
    this.content = content;
    this.interaction = interaction;
    this.paramChanges = paramChanges;
    this.recordedVoiceovers = recordedVoiceovers;
    this.solicitAnswerDetails = solicitAnswerDetails;
    this.writtenTranslations = writtenTranslations;
  }
  setName(newName: string): void {
    this.name = newName;
  }

  // TODO(#7165): Replace any with exact type.
  toBackendDict(): any {
    return {
      content: this.content.toBackendDict(),
      classifierModelId: this.classifierModelId,
      interaction: this.interaction.toBackendDict(),
      paramChanges: this.paramChanges.map((paramChange) => {
        return paramChange.toBackendDict();
      }),
      recordedVoiceovers: this.recordedVoiceovers.toBackendDict(),
      solicitAnswerDetails: this.solicitAnswerDetails,
      writtenTranslations: this.writtenTranslations.toBackendDict()
    };
  }

  // TODO(#7165): Replace any with exact type.
  copy(otherState: any): void {
    this.name = otherState.name;
    this.classifierModelId = otherState.classifierModelId;
    this.content = otherState.content;
    this.interaction.copy(otherState.interaction);
    this.paramChanges = otherState.paramChanges;
    this.recordedVoiceovers = otherState.recordedVoiceovers;
    this.solicitAnswerDetails = otherState.solicitAnswerDetails;
    this.writtenTranslations = otherState.writtenTranslations;
  }
}

@Injectable({
  providedIn: 'root'
})
export class StateObjectFactory {
  constructor(
    private interactionObject: InteractionObjectFactory,
    private paramchangesObject: ParamChangesObjectFactory,
    private recordedVoiceoversObject: RecordedVoiceoversObjectFactory,
    private subtitledHtmlObject: SubtitledHtmlObjectFactory,
    private writtenTranslationsObject: WrittenTranslationsObjectFactory) {}

  createDefaultState(newStateName: string): State {
    var newStateTemplate = constants.NEW_STATE_TEMPLATE;
    // These should remain in snake_case because the NEW_STATE_TEMPLATE
    // in constants.js is in snake_case because it is used in backend too.
    var newState = this.createFromBackendDict(newStateName, {
      classifier_model_id: newStateTemplate.classifier_model_id,
      content: newStateTemplate.content,
      interaction: newStateTemplate.interaction,
      paramChanges: newStateTemplate.param_changes,
      recordedVoiceovers: newStateTemplate.recorded_voiceovers,
      solicitAnswerDetails: newStateTemplate.solicit_answer_details,
      writtenTranslations: newStateTemplate.written_translations
    });
    newState.interaction.defaultOutcome.dest = newStateName;
    return newState;
  }
  // TODO(#7165): Replace any with exact type.
  createFromBackendDict(stateName: string, stateDict: any): State {
    return new State(
      stateName,
      stateDict.classifierModelId,
      this.subtitledHtmlObject.createFromBackendDict(stateDict.content),
      this.interactionObject.createFromBackendDict(stateDict.interaction),
      this.paramchangesObject.createFromBackendList(
        stateDict.paramChanges),
      this.recordedVoiceoversObject.createFromBackendDict(
        stateDict.recordedVoiceovers),
      stateDict.solicitAnswerDetails,
      this.writtenTranslationsObject.createFromBackendDict(
        stateDict.writtenTranslations));
  }
}

angular.module('oppia').factory(
  'StateObjectFactory',
  downgradeInjectable(StateObjectFactory));
