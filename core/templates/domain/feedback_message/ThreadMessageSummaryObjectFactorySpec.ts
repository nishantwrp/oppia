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
 * @fileoverview Unit tests for ThreadMessageSummaryObjectFactory.
 */

import { TestBed } from '@angular/core/testing';

import { ThreadMessageSummaryObjectFactory } from
  'domain/feedback_message/ThreadMessageSummaryObjectFactory';

describe('Thread message summary object factory', () => {
  let threadMessageSummaryObjectFactory: ThreadMessageSummaryObjectFactory;

  beforeEach(() => {
    threadMessageSummaryObjectFactory = TestBed.get(
      ThreadMessageSummaryObjectFactory);
  });

  describe('.createNew', () => {
    it('should create new thread message summary from arguments.', () => {
      let threadMessageSummary =
        threadMessageSummaryObjectFactory.createNew(
          'author', 'message content');

      expect(threadMessageSummary.authorUsername).toEqual('author');
      expect(threadMessageSummary.text).toEqual('message content');
    });
  });

  describe('.hasText', () => {
    it('should be true when text is nonempty string', () => {
      let threadMessageSummary =
        threadMessageSummaryObjectFactory.createNew('author', 'nonempty!');

      expect(threadMessageSummary.hasText()).toBe(true);
    });

    it('should be false when text is empty string', () => {
      let threadMessageSummary =
        threadMessageSummaryObjectFactory.createNew('author', '');

      expect(threadMessageSummary.hasText()).toBe(false);
    });
  });
});
