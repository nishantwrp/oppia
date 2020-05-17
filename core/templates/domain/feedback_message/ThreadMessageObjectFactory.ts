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
 * @fileoverview Factory for creating new frontend instances of thread message
 * domain objects.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { ThreadMessageSummary, ThreadMessageSummaryObjectFactory } from
  'domain/feedback_message/ThreadMessageSummaryObjectFactory';

export class ThreadMessage {
  authorUsername: string;
  createdOnMsecs: number;
  entityType: string;
  entityId: string;
  messageId: number;
  text: string = '';
  updatedStatus: string = null;
  updatedSubject: string = null;
  summary: ThreadMessageSummary;

  constructor(
      authorUsername: string, createdOnMsecs: number, entityType: string,
      entityId: string, messageId: number, text: string, updatedStatus: string,
      updatedSubject: string, summary: ThreadMessageSummary) {
    this.authorUsername = authorUsername;
    this.createdOnMsecs = createdOnMsecs;
    this.entityType = entityType;
    this.entityId = entityId;
    this.messageId = messageId;
    this.text = text;
    this.updatedStatus = updatedStatus;
    this.updatedSubject = updatedSubject;
    this.summary = summary;
  }

  hasText(): boolean {
    return this.text.length > 0;
  }

  hasStatusUpdate(): boolean {
    return this.updatedStatus !== null;
  }

  hasSubjectUpdate(): boolean {
    return this.updatedSubject !== null;
  }
}

@Injectable({providedIn: 'root'})
export class ThreadMessageObjectFactory {
  constructor(
    private threadMessageSummaryObjectFactory:
      ThreadMessageSummaryObjectFactory) {}

  // TODO(#7176): Replace 'any' with the exact type. This has been kept as
  // 'any' because 'threadMessageBackendDict' is a dict with underscore_cased
  // keys which give tslint errors against underscore_casing in favor of
  // camelCasing.
  createFromBackendDict(threadMessageBackendDict: any): ThreadMessage {
    return new ThreadMessage(
      threadMessageBackendDict.authorUsername,
      threadMessageBackendDict.createdOnMsecs,
      threadMessageBackendDict.entityType, threadMessageBackendDict.entityId,
      threadMessageBackendDict.messageId, threadMessageBackendDict.text,
      threadMessageBackendDict.updatedStatus,
      threadMessageBackendDict.updatedSubject,
      this.threadMessageSummaryObjectFactory.createNew(
        threadMessageBackendDict.authorUsername,
        threadMessageBackendDict.text));
  }
}

angular.module('oppia').factory(
  'ThreadMessageObjectFactory',
  downgradeInjectable(ThreadMessageObjectFactory));
