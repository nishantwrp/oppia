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
 * @fileoverview Service to convert object keys from one case to another
 */

import { Injectable } from '@angular/core';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class ObjectKeysCaseChangeService {
  _toCamel(s: string): string {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '');
    });
  }

  _isArray(o: object): Boolean {
    return Array.isArray(o);
  }

  _isObject(o: any): any {
    return o === Object(o) && !this._isArray(o) && typeof o !== 'function';
  }

  snakeToCamel(o: any): any {
    if (this._isObject(o)) {
      const n = {};

      Object.keys(o)
        .forEach((k) => {
          n[this._toCamel(k)] = this.snakeToCamel(o[k]);
        });

      return n;
    } else if (this._isArray(o)) {
      return o.map((i) => {
        return this.snakeToCamel(i);
      });
    }

    return o;
  }
}

angular.module('oppia').factory(
  'ObjectKeysCaseChangeService',
  downgradeInjectable(ObjectKeysCaseChangeService));
