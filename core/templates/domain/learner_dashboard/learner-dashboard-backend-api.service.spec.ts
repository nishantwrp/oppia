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
 * @fileoverview Unit tests for LearnerDashboardBackendApiService.
 */

import { HttpClientTestingModule, HttpTestingController } from
  '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { LearnerDashboardBackendApiService } from
  'domain/learner_dashboard/learner-dashboard-backend-api.service';

describe('Learner Dashboard Backend API Service', () => {
  let learnerDashboardBackendApiService:
    LearnerDashboardBackendApiService = null;
  let httpTestingController: HttpTestingController;

  var sampleDataResults = {
    username: 'test',
    numberOfUnreadThreads: 0,
    completedToIncompleteCollections: [],
    isAdmin: false,
    profilePictureDataUrl: 'TestURL',
    explorationPlaylist: [],
    userEmail: 'test@example.com',
    collectionPlaylist: [],
    isModerator: false,
    numberOfNonexistentActivities: {
      completedCollections: 0,
      incompleteCollections: 0,
      collectionPlaylist: 0,
      incompleteExplorations: 0,
      explorationPlaylist: 0,
      completedExplorations: 0
    },
    incompleteCollectionsList: [],
    threadSummaries: [],
    incompleteExplorationsList: [],
    subscriptionList: [],
    completedExplorationsList: [],
    isSuperAdmin: false,
    completedCollectionsList: []
  };

  var LEARNER_DASHBOARD_DATA_URL = '/learnerdashboardhandler/data';
  var ERROR_STATUS_CODE = 500;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LearnerDashboardBackendApiService]
    });
    learnerDashboardBackendApiService = TestBed.get(
      LearnerDashboardBackendApiService);

    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should successfully fetch learner dashboard data from the backend',
    fakeAsync(() => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      learnerDashboardBackendApiService.fetchLearnerDashboardData()
        .then(successHandler, failHandler);

      var req = httpTestingController.expectOne(LEARNER_DASHBOARD_DATA_URL);
      expect(req.request.method).toEqual('GET');
      req.flush(sampleDataResults);

      flushMicrotasks();

      expect(successHandler).toHaveBeenCalledWith(sampleDataResults);
      expect(failHandler).not.toHaveBeenCalled();
    }
    ));

  it(
    'should use rejection handler if learner dashboard data ' +
    'backend request failed',
    fakeAsync(() => {
      var successHandler = jasmine.createSpy('success');
      var failHandler = jasmine.createSpy('fail');

      learnerDashboardBackendApiService.fetchLearnerDashboardData()
        .then(successHandler, (error: HttpErrorResponse) => {
          // This is done because the error callback gets called with an
          // HttpErrorResponse object, not with the error message. The following
          // line extracts the error message and calls the failHandler with the
          // error message as the parameter.
          failHandler(error.error);
        });

      var req = httpTestingController.expectOne(LEARNER_DASHBOARD_DATA_URL);
      expect(req.request.method).toEqual('GET');
      req.flush('Error loading dashboard data.', {
        status: ERROR_STATUS_CODE, statusText: 'Invalid Request'
      });

      flushMicrotasks();

      expect(successHandler).not.toHaveBeenCalled();
      expect(failHandler).toHaveBeenCalledWith(
        'Error loading dashboard data.');
    }));
});
