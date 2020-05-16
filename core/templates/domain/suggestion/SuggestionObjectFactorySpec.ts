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
 * @fileoverview Unit tests for SuggestionObjectFactory.
 */

import { TestBed } from '@angular/core/testing';

import { SuggestionObjectFactory } from
  'domain/suggestion/SuggestionObjectFactory';

describe('SuggestionObjectFactory', () => {
  beforeEach(() => {
    this.factory = TestBed.get(SuggestionObjectFactory);
  });

  it('should create a new suggestion from a backend dict.', () => {
    let suggestionBackendDict = {
      suggestionId: 'exploration.exp1.thread1',
      suggestionType: 'edit_exploration_state_content',
      targetType: 'exploration',
      targetId: 'exp1',
      targetVersionAtSubmission: 1,
      status: 'accepted',
      authorName: 'author',
      change: {
        cmd: 'edit_state_property',
        property_name: 'content',
        state_name: 'state_1',
        new_value: 'new suggestion content',
        old_value: 'old suggestion content'
      },
      lastUpdatedMsecs: 1000
    };
    let suggestion = this.factory.createFromBackendDict(suggestionBackendDict);
    expect(suggestion.suggestionType).toEqual('edit_exploration_state_content');
    expect(suggestion.targetType).toEqual('exploration');
    expect(suggestion.targetId).toEqual('exp1');
    expect(suggestion.suggestionId).toEqual('exploration.exp1.thread1');
    expect(suggestion.status).toEqual('accepted');
    expect(suggestion.authorName).toEqual('author');
    expect(suggestion.stateName).toEqual('state_1');
    expect(suggestion.newValue).toEqual('new suggestion content');
    expect(suggestion.oldValue).toEqual('old suggestion content');
    expect(suggestion.lastUpdatedMsecs).toEqual(1000);
    expect(suggestion.getThreadId()).toEqual('exploration.exp1.thread1');
  });
});
