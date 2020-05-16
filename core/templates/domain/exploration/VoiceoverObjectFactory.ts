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
 * @fileoverview Factory for creating new frontend instances of
 * Voiceover domain objects.
 */
export interface IVoiceoverDict {
  durationSecs: number;
  filename: string;
  fileSizeBytes: number;
  needsUpdate: boolean;
}

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

export class Voiceover {
  filename: string;
  fileSizeBytes: number;
  needsUpdate: boolean;
  durationSecs: number;

  constructor(filename: string, fileSizeBytes: number, needsUpdate: boolean,
      durationSecs: number) {
    this.filename = filename;
    this.fileSizeBytes = fileSizeBytes;
    this.needsUpdate = needsUpdate;
    this.durationSecs = durationSecs;
  }

  markAsNeedingUpdate(): void {
    this.needsUpdate = true;
  }

  toggleNeedsUpdateAttribute(): void {
    this.needsUpdate = !this.needsUpdate;
  }

  getFileSizeMB(): number {
    var NUM_BYTES_IN_MB = 1 << 20;
    return this.fileSizeBytes / NUM_BYTES_IN_MB;
  }

  toBackendDict(): IVoiceoverDict {
    return {
      filename: this.filename,
      fileSizeBytes: this.fileSizeBytes,
      needsUpdate: this.needsUpdate,
      durationSecs: this.durationSecs
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class VoiceoverObjectFactory {
  createNew(filename: string, fileSizeBytes: number,
      durationSecs: number): Voiceover {
    return new Voiceover(filename, fileSizeBytes, false, durationSecs);
  }

  createFromBackendDict(
      translationBackendDict: IVoiceoverDict): Voiceover {
    return new Voiceover(
      translationBackendDict.filename,
      translationBackendDict.fileSizeBytes,
      translationBackendDict.needsUpdate,
      translationBackendDict.durationSecs);
  }
}

angular.module('oppia').factory(
  'VoiceoverObjectFactory', downgradeInjectable(VoiceoverObjectFactory));
