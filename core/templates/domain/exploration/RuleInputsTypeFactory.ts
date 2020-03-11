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
 * @fileoverview Type Definitions for Rule Inputs
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { IFractionDict } from 'domain/objects/FractionObjectFactory';
/* eslint-disable max-len */
import { Note } from 'extensions/interactions/MusicNotesInput/directives/music-notes-input-rules.service';
import { Unit } from 'domain/objects/UnitsObjectFactory';

interface NumberWithUnitsDict {
  type: string;
  real: number;
  fraction: IFractionDict;
  units: Unit[]
}

interface GraphVertex {
  x: number;
  y: number;
  label: string;
}

interface GraphEdge {
  src: number;
  dst: number;
  weight: number;
}

interface GraphDict {
  isDirected: boolean;
  isWeighted: boolean;
  isLabeled: boolean;
  vertices: GraphVertex[];
  edges: GraphEdge[];
}

export interface RuleInputs {
  [variable: string]: (string | number | IFractionDict | NumberWithUnitsDict
    | string[] | Note[] | number[] | GraphDict);
}

export class RuleInputsTypeFactory {
  _isGraphDict(variable: Object): variable is GraphDict {
    return 'isDirected' in variable;
  }

  graphDictInstance(variable: (string | number | IFractionDict | NumberWithUnitsDict
    | string[] | Note[] | number[] | GraphDict)): GraphDict {
    if (this._isGraphDict(variable)) {
      return variable;
    }
  }
}
