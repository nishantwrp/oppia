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
 * @fileoverview Unit tests for FeedbackThreadObjectFactory.
 */

import { TestBed } from '@angular/core/testing';

import { FeedbackThreadObjectFactory } from
  'domain/feedback_thread/FeedbackThreadObjectFactory';
import { ThreadMessageObjectFactory } from
  'domain/feedback_message/ThreadMessageObjectFactory';

describe('FeedbackThreadObjectFactory', () => {
  beforeEach(() => {
    this.feedbackThreadObjectFactory = TestBed.get(FeedbackThreadObjectFactory);
    this.threadMessageObjectFactory = TestBed.get(ThreadMessageObjectFactory);
  });

  describe('.createFromBackendDict', () => {
    it('should create a new feedback thread from a backend dict.', () => {
      let feedbackThreadBackendDict = {
        lastUpdatedMsecs: 1000,
        originalAuthorUsername: 'author',
        status: 'accepted',
        subject: 'sample subject',
        summary: 'sample summary',
        messageCount: 10,
        stateName: 'state 1',
        threadId: 'exp1.thread1',
        lastNonemptyMessageAuthor: 'author',
        lastNonemptyMessageText: 'tenth message'
      };

      let feedbackThread =
        this.feedbackThreadObjectFactory.createFromBackendDict(
          feedbackThreadBackendDict);
      expect(feedbackThread.status).toEqual('accepted');
      expect(feedbackThread.subject).toEqual('sample subject');
      expect(feedbackThread.summary).toEqual('sample summary');
      expect(feedbackThread.originalAuthorName).toEqual('author');
      expect(feedbackThread.lastUpdatedMsecs).toEqual(1000);
      expect(feedbackThread.messageCount).toEqual(10);
      expect(feedbackThread.stateName).toEqual('state 1');
      expect(feedbackThread.threadId).toEqual('exp1.thread1');
      expect(feedbackThread.isSuggestionThread()).toEqual(false);
      expect(feedbackThread.lastNonemptyMessageSummary.authorUsername)
        .toEqual('author');
      expect(feedbackThread.lastNonemptyMessageSummary.text)
        .toEqual('tenth message');
    });
  });

  describe('FeedbackThread', () => {
    describe('.setMessages', () => {
      it('should update message-related fields', () => {
        let feedbackThread =
          this.feedbackThreadObjectFactory.createFromBackendDict({
            lastUpdatedMsecs: 1000,
            originalAuthorUsername: 'author',
            status: 'accepted',
            subject: 'sample subject',
            summary: 'sample summary',
            messageCount: 10,
            stateName: 'state 1',
            threadId: 'exp1.thread1',
            lastNonemptyMessageAuthor: 'author',
            lastNonemptyMessageText: 'tenth message'
          });

        expect(feedbackThread.getMessages()).toEqual([]);

        let messages = [
          this.threadMessageObjectFactory.createFromBackendDict({
            author_username: 'author1',
            text: 'message1',
            updated_subject: null,
            created_on_msecs: 1000,
            entity_type: 'exploration',
            entity_id: 'exploration.exp1.thread1',
            message_id: 1,
            updated_status: null
          }),
          this.threadMessageObjectFactory.createFromBackendDict({
            author_username: 'author2',
            text: 'message2',
            updated_subject: null,
            created_on_msecs: 1000,
            entity_type: 'exploration',
            entity_id: 'exploration.exp1.thread1',
            message_id: 1,
            updated_status: null
          })
        ];

        feedbackThread.setMessages(messages);

        expect(feedbackThread.messages).toEqual(messages);
        expect(feedbackThread.messageCount).toEqual(messages.length);
        expect(feedbackThread.lastNonemptyMessageSummary.authorUsername)
          .toEqual('author2');
        expect(feedbackThread.lastNonemptyMessageSummary.text)
          .toEqual('message2');
      });
    });
  });
});
