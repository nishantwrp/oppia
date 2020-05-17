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
 * @fileoverview Unit tests for WrittenTranslationsObjectFactory.ts
 */
import { TestBed } from '@angular/core/testing';

import { WrittenTranslationsObjectFactory } from
  'domain/exploration/WrittenTranslationsObjectFactory';
import { WrittenTranslationObjectFactory } from
  'domain/exploration/WrittenTranslationObjectFactory';

describe('Written Translations Object Factory', () => {
  let writtenTranslationsObjectFactory;
  let writtenTranslationObjectFactory;
  let writtenTranslationsBackendDict;

  beforeEach(() => {
    writtenTranslationsObjectFactory = TestBed.get(
      WrittenTranslationsObjectFactory);
    writtenTranslationObjectFactory = TestBed.get(
      WrittenTranslationObjectFactory);

    writtenTranslationsBackendDict = (
      writtenTranslationsObjectFactory.createFromBackendDict({
        translationsMapping: {
          content1: {
            'hi-en': {
              html: '',
              needsUpdate: false
            }
          }
        }
      }));
  });

  it('should create a written translations object from backend dict', () => {
    expect(writtenTranslationsBackendDict.toBackendDict())
      .toEqual({
        translationsMapping: {
          content1: {
            'hi-en': {
              html: '',
              needsUpdate: false
            }
          }
        }
      });
  });

  it('should create an empty written translations object', () => {
    const emptyWrittenTranslationsObject = (
      writtenTranslationsObjectFactory.createEmpty());
    expect(emptyWrittenTranslationsObject.getAllContentId()).toEqual([]);
  });

  it('should add and delete contents from a written translations object',
    () => {
      expect(writtenTranslationsBackendDict.getAllContentId()).toEqual([
        'content1']);
      writtenTranslationsBackendDict.addContentId('content_2');
      expect(writtenTranslationsBackendDict.getAllContentId()).toEqual([
        'content1', 'content_2']);
      expect(() => {
        writtenTranslationsBackendDict.addContentId('content_2');
      }).toThrowError('Trying to add duplicate content id.');
      expect(writtenTranslationsBackendDict.getAllContentId()).toEqual([
        'content1', 'content_2']);

      writtenTranslationsBackendDict.deleteContentId('content_2');
      expect(writtenTranslationsBackendDict.getAllContentId()).toEqual([
        'content1']);
      expect(() => {
        writtenTranslationsBackendDict.deleteContentId('content_2');
      }).toThrowError('Unable to find the given content id.');
      expect(writtenTranslationsBackendDict.getAllContentId()).toEqual([
        'content1']);
    });

  it('should add translation in a written translations object', () => {
    expect(() => {
      writtenTranslationsBackendDict.addWrittenTranslation(
        'content1', 'hi-en', 'This is a HTML text');
    }).toThrowError('Trying to add duplicate language code.');

    writtenTranslationsBackendDict.addWrittenTranslation(
      'content1', 'en', 'English HTML');
    expect(writtenTranslationsBackendDict
      .getTranslationsLanguageCodes('content1')).toEqual(['hi-en', 'en']);
  });

  it('should update the html language code of a written translations object',
    () => {
      const writtenTranslationsBackendDict = (
        writtenTranslationsObjectFactory.createFromBackendDict({
          translationsMapping: {
            content1: {
              'hi-en': {
                html: '<p>This is the old HTML</p>',
                needsUpdate: false
              }
            }
          }
        }));

      expect(writtenTranslationsBackendDict.hasWrittenTranslation(
        'content1', 'hi-en')).toBe(true);
      writtenTranslationsBackendDict.updateWrittenTranslationHtml(
        'content1', 'hi-en', '<p>This is the new HTML</p>');
      expect(writtenTranslationsBackendDict.getWrittenTranslation(
        'content1', 'hi-en')).toEqual(
        writtenTranslationObjectFactory.createFromBackendDict({
          html: '<p>This is the new HTML</p>',
          needsUpdate: false
        }));

      expect(() => {
        writtenTranslationsBackendDict.updateWrittenTranslationHtml(
          'content1', 'en', 'This is the new HTML');
      }).toThrowError('Unable to find the given language code.');
      expect(writtenTranslationsBackendDict.hasWrittenTranslation('en'))
        .toBe(false);
    });

  it('should toggle needsUpdate for a language code', () => {
    writtenTranslationsBackendDict.toggleNeedsUpdateAttribute(
      'content1', 'hi-en');
    expect(writtenTranslationsBackendDict.getWrittenTranslation(
      'content1', 'hi-en')).toEqual(
      writtenTranslationObjectFactory.createFromBackendDict({
        html: '',
        needsUpdate: true
      }));
    expect(writtenTranslationsBackendDict.hasUnflaggedWrittenTranslations(
      'content1')).toBe(false);

    writtenTranslationsBackendDict.toggleNeedsUpdateAttribute(
      'content1', 'hi-en');
    expect(writtenTranslationsBackendDict.getWrittenTranslation(
      'content1', 'hi-en')).toEqual(
      writtenTranslationObjectFactory.createFromBackendDict({
        html: '',
        needsUpdate: false
      }));
    expect(writtenTranslationsBackendDict.hasUnflaggedWrittenTranslations(
      'content1')).toBe(true);
  });

  it('should set needsUpdate to true in all translations from a content',
    () => {
      const writtenTranslationsBackendDict = (
        writtenTranslationsObjectFactory.createFromBackendDict({
          translationsMapping: {
            content1: {
              'hi-en': {
                html: 'This is the old HTML',
                needsUpdate: false
              },
              en: {
                html: '',
                needsUpdate: false
              }
            }
          }
        }));

      writtenTranslationsBackendDict.markAllTranslationsAsNeedingUpdate(
        'content1');
      expect(writtenTranslationsBackendDict.getWrittenTranslation(
        'content1', 'hi-en')).toEqual(
        writtenTranslationObjectFactory.createFromBackendDict({
          html: 'This is the old HTML',
          needsUpdate: true
        }));
      expect(writtenTranslationsBackendDict.getWrittenTranslation(
        'content1', 'en')).toEqual(
        writtenTranslationObjectFactory.createFromBackendDict({
          html: '',
          needsUpdate: true
        }));
      expect(writtenTranslationsBackendDict.hasUnflaggedWrittenTranslations(
        'content1')).toBe(false);
    });
});
