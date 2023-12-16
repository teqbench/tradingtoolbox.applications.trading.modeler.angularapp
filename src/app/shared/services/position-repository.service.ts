import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, retry, tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { PositionInput, IPositionInput } from '../models/position-input';
import { HttpErrorHandlerService, HandleError } from './http-error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { IPatch, MultiPatchItem } from '../models/http/patch';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

/**
 * Service class managing DB access from the web client.
 *
 * @export
 * @class PositionRepositoryService
 */
@Injectable({
  providedIn: 'root'
})
export class PositionRepositoryService {
  private _handleError: HandleError;

  private readonly BASE_URL_TRADE_MODELER_SCENARIOS: string = "/api/at/tradingpositionmodeler/positions/";
  private readonly URL_GET_ALL_MODELS_SERVICE: URL;
  private readonly URL_CREATE_MODEL_SERVICE: URL;
  private readonly URL_UPDATE_MODEL_SERVICE: URL;
  private readonly URL_UPDATE_MODELS_SERVICE: URL;
  private readonly URL_DELETE_MODEL_SERVICE: URL;
  private readonly URL_DELETE_MODELS_SERVICE: URL;
  private readonly URL_REORDER_MODELS_SERVICE: URL;

  /**
   * Creates an instance of PositionRepositoryService.
   * @param {HttpClient} _httpClient
   * @param {string} _serviceApiTradingToolboxTradingPositionModelBaseUrl
   * @param {HttpErrorHandlerService} _httpErrorHandlerService
   * @param {NotificationService} _notificationService
   * @memberof PositionRepositoryService
   */
  constructor(private _httpClient: HttpClient, @Inject('SERVICE_API_TRADING_TOOLBOX_TRADING_POSITION_MODELER_BASE_URL') private _serviceApiTradingToolboxTradingPositionModelBaseUrl: string, private _httpErrorHandlerService: HttpErrorHandlerService, private _notificationService: NotificationService) {
    this._handleError = _httpErrorHandlerService.createHandleError('PositionRepositoryService');

    this.URL_GET_ALL_MODELS_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS, this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_CREATE_MODEL_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS, this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_UPDATE_MODEL_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS, this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_UPDATE_MODELS_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS, this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_DELETE_MODEL_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS, this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_DELETE_MODELS_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS + "delete-multiple", this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
    this.URL_REORDER_MODELS_SERVICE = new URL(this.BASE_URL_TRADE_MODELER_SCENARIOS + "patch-multiple", this._serviceApiTradingToolboxTradingPositionModelBaseUrl);
  }

  /**
   * Gets a list of all position documents from DB.
   *
   * @return {*}  {Observable<PositionInput[]>} List of all the documents in the DB.
   * @memberof PositionRepositoryService
   */
  public getAllPositionDocuments(): Observable<PositionInput[]> {
    return this._httpClient
      .get<IPositionInput[]>(this.URL_GET_ALL_MODELS_SERVICE.href, HTTP_OPTIONS)
      .pipe(
        map((models: IPositionInput[]) => {
          return models.map(value => {
            return new PositionInput(value as PositionInput);
          });
        }),
        catchError(this._handleError('getAllPositionDocuments', [])));
  }

  /**
   * Create a new position document in the DB.
   *
   * @param {IPositionInput} model
   * @return {*}  {Observable<IPositionInput>} The saved new document with ID value from DB.
   * @memberof PositionRepositoryService
   */
  public createPositionDocument(model: IPositionInput): Observable<IPositionInput> {
    return this._httpClient
      .post<IPositionInput>(this.URL_CREATE_MODEL_SERVICE.href, model, HTTP_OPTIONS)
      .pipe(
        tap(reponse => {
          this._notificationService.success("Position " + reponse.name + " created!");
        }),
        catchError(this._handleError('createPositionDocument', model))
      );
  }

  /**
   * Update one position document in the DB.
   *
   * @param {IPositionInput} model The updated document to save in the DB.
   * @return {*}  {Observable<IPositionInput>} The updated document from the DB.
   * @memberof PositionRepositoryService
   */
  public updatePositionDocument(model: IPositionInput): Observable<IPositionInput> {
    return this._httpClient
      .put<IPositionInput>(this.URL_UPDATE_MODEL_SERVICE.href, model, HTTP_OPTIONS)
      .pipe(
        tap(reponse => {
          this._notificationService.success("Position " + reponse.name + " updated!");
        }),
        catchError(this._handleError('updatePositionDocument', model))
      );
  }

  /**
   * Update many position documents at once/
   *
   * @param {string[]} ids The IDs of the documents to update.
   * @param {IPatch<any>[]} patches The field level specific updates.
   * @return {*}  {Observable<IPositionInput[]>} List of updated documents.
   * @memberof PositionRepositoryService
   */
  public updatePositionDocuments(ids: string[], patches: IPatch<any>[]): Observable<IPositionInput[]> {
    // In nearly all examples, patch documents are passed as part of the body and any ID is part of the resource URL.
    // In this case with more than one ID, necessary to pass both as part of the body; tried to pass one in the header
    // and the other as part of the body, but was having a heck of a time getting the data out of out of the header on 
    // the serve side; worked OK when request came from Swagger but from Angular, could not get it to work. Compromised 
    // solution is current implementation of sending both as part of the body.
    const patchRequest: any = { ids: ids, patchDocument: patches };
    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json-patch+json");

    let body = JSON.stringify(patchRequest);
    return this._httpClient
      .patch<IPositionInput[]>(this.URL_UPDATE_MODELS_SERVICE.href, body, { headers: headers })
      .pipe(
        map((models: IPositionInput[]) => {
          this._notificationService.success(models.length + " Position(s) updated!");

          return models.map(value => {
            return new PositionInput(value as PositionInput);
          });
        }),
        catchError(this._handleError('updatePositionDocuments', []))
      );
  }

  /**
   * Presist the new order of position documents (typically done via user dragging/dropping a row)
   *
   * @param {MultiPatchItem[]} items List of patch items reorder in the DB.
   * @return {*}  {Observable<IPositionInput[]>} List of reorderd documents.
   * @memberof PositionRepositoryService
   */
  public reorderPositionDocuments(items: MultiPatchItem[]): Observable<IPositionInput[]> {
    const headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json-patch+json");

    let body = JSON.stringify(items);
    return this._httpClient
      .patch<IPositionInput[]>(this.URL_REORDER_MODELS_SERVICE.href, body, { headers: headers })
      .pipe(
        map((models: IPositionInput[]) => {
          this._notificationService.success(models.length + " Position(s) ordering updated!");

          return models.map(value => {
            return new PositionInput(value as PositionInput);
          });
        }),
        catchError(this._handleError('reorderPositionDocuments', []))
      );
  }

  /**
   * Delete one position document by ID (string) in the DB.
   *
   * @param {string} id The ID of the document to delete.
   * @return {*} An observable boolean indicating if the document associated with the supplied id was successfully deleted.
   * @memberof PositionRepositoryService
   */
  public deletePositionDocumentById(id: string) {
    return this._httpClient
      .delete<boolean>(this.URL_DELETE_MODEL_SERVICE.href + id, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this._notificationService.success("Position deleted!");
        }),
        catchError(this._handleError('deletePositionDocumentById'))
      );
  }

  /**
   * Delete many position documents by IDs (list of strings) in the DB.
   *
   * @param {string[]} ids of the documents to delete.
   * @return {*} An observable boolean indicating if the documents associated with the supplied ids were successfully deleted.
   * @memberof PositionRepositoryService
   */
  public deletePositionDocumentsByIds(ids: string[]) {
    let body = JSON.stringify(ids);
    return this._httpClient
      .post<boolean>(this.URL_DELETE_MODELS_SERVICE.href, body, HTTP_OPTIONS)
      .pipe(
        tap(res => {
          this._notificationService.success(ids.length + " position(s) deleted!");
        }),
        catchError(this._handleError('deletePositionDocumentsByIds'))
      );
  }
}
