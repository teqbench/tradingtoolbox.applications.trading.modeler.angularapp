import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { NotificationService } from 'src/app/core/services/notification.service';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError = <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/**
 * Handles HttpClient errors
 * 
 * Based on https://stackblitz.com/angular/bvbxxbealvj?file=src%2Fapp%2Fhttp-error-handler.service.ts
 *
 * @export
 * @class HttpErrorHandlerService
 */
@Injectable()
export class HttpErrorHandlerService {
  constructor(private _notificationService: NotificationService) { }

  /**
   * Create curried handleError function that already knows the service name
   *
   * @param {string} [serviceName=''] name of the data service that attempted the operation
   * @memberof HttpErrorHandlerService
   */
  createHandleError = (serviceName = '') => {
    return <T>(operation = 'operation', result = {} as T) => this.handleError(serviceName, operation, result);
  }

  /**
   * Returns a function that handles Http operation failures.
   * This error handler lets the app continue to run as if no error occurred.
   * 
   * @param serviceName = name of the data service that attempted the operation
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  handleError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
        `server returned code ${error.status} with body "${error.error}"`;

      // TODO: better job of transforming error for user consumption
      this._notificationService.error(`${serviceName}: ${operation} failed: ${message}`);

      // Let the app keep running by returning a safe result.
      return of(result);
    };

  }
}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at https://angular.io/license
*/