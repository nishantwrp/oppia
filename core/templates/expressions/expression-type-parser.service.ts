// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Unit tests for Expression Type Parser Service.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';

import { ExpressionParserService } from
  'expressions/expression-parser.service.ts';
import { EnvDict, Expr, ExpressionSyntaxTreeService } from
  'expressions/expression-syntax-tree.service';

  @Injectable({
    providedIn: 'root'
  })
export class ExpressionTypeParserService {
  constructor(
      private expressionParserService: ExpressionParserService,
      private expressionSyntaxTreeService: ExpressionSyntaxTreeService,
      private PARAMETER_TYPES) {}

  getExpressionOutputType(expression: string, envs: EnvDict[]): Expr {
    return this.expressionSyntaxTreeService.applyFunctionToParseTree(
      this.expressionParserService.parse(expression), envs,
      (parsed, envs) => this.getType(parsed, envs));
  }

  /**
     * @param {*} parsed Parse output from the parser. See parser.pegjs for
     *     the data structure.
     * @param {!Array.<!Object>} envs Represents a nested name space
     *     environment to look up the name in. The first element is looked
     *     up first (i.e. has higher precedence). The values of each Object
     *     are strings representing a parameter type (i.e. they are equal to
     *     values in the PARAMETER_TYPES object).
     */
  getType(parsed, envs: EnvDict[]): Expr {
    // The intermediate nodes of the parse tree are arrays. The terminal
    // nodes are JavaScript primitives (as described in the "Parser output"
    // section of parser.pegjs).
    if (parsed instanceof Array) {
      if (parsed.length === 0) {
        throw new Error(
          'Parser generated an intermediate node with zero children');
        }

        if (parsed[0] === '#') {
          return ExpressionSyntaxTreeService.lookupEnvs(parsed[1], envs);
        }

        // Get the types of the arguments.
        var args = parsed.slice(1).map(function(item) {
          return this.getType(item, envs);
        });

        // The first element should be a function name.
        return ExpressionSyntaxTreeService.lookupEnvs(
          parsed[0], envs).getType(args);
      }

      // If 'parsed' is not an array, it should be a terminal node with the
      // actual value.
      return (
        isNaN(+parsed) ?
          this.PARAMETER_TYPES.UNICODE_STRING :
          this.PARAMETER_TYPES.REAL);
      
    };
  }

angular.module('oppia').factory(
  'ExpressionTypeParserService',
  downgradeInjectable(ExpressionTypeParserService));
