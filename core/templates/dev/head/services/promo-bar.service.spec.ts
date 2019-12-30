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
 * @fileoverview Tests that the resource service is working as expected.
 */

import { HttpClientTestingModule, HttpTestingController } from
  '@angular/common/http/testing';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { PromoBarService } from
  'services/promo-bar.service';

export interface PromoBarData {
  promoBarEnabled: boolean,
  promoBarMessage: string
}

describe('Promo bar Service', () => {
  let promoBarService: PromoBarService = null;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PromoBarService]
    });
    promoBarService = TestBed.get(PromoBarService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should return promo bar data',
    fakeAsync(() => {
      promoBarService.getPromoBarData().then(function(data: PromoBarData) {
        expect(data.promoBarEnabled).toBe(true);
        expect(data.promoBarMessage).toBe('test message');
      });

      var req = httpTestingController.expectOne('/promo_bar_handler');
      expect(req.request.method).toEqual('GET');
      req.flush({
        promo_bar_enabled: true,
        promo_bar_message: 'test message'
      });

      flushMicrotasks();
    })
  );
});
