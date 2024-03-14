import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProspecto, getProspectoIdentifier } from '../prospecto.model';

export type EntityResponseType = HttpResponse<IProspecto>;
export type EntityArrayResponseType = HttpResponse<IProspecto[]>;

@Injectable({ providedIn: 'root' })
export class ProspectoService {
  public resourceUrl = this.applicationConfigService.environmentConfig.prospectosUri;
  public resourceDocumentosUrl = this.applicationConfigService.environmentConfig.documentosUri;

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(prospecto: any): any {
    return this.http.post(this.resourceUrl, prospecto);
  }

  update(prospecto: any): Observable<EntityResponseType> {
    return this.http.put<IProspecto>(`${this.resourceUrl}/${getProspectoIdentifier(prospecto) as number}`, prospecto, {
      observe: 'response',
    });
  }

  autorizar(nProspecto: number): any {
    return this.http.put<IProspecto>(`${this.resourceUrl}/autorizar/${nProspecto}`, {
      observe: 'response',
    });
  }

  rechazar(data: any): any {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return this.http.put<IProspecto>(`${this.resourceUrl}/rechazar/${data.nProspecto}`, data, {
      observe: 'response',
    });
  }

  partialUpdate(prospecto: IProspecto): Observable<EntityResponseType> {
    return this.http.patch<IProspecto>(`${this.resourceUrl}/${getProspectoIdentifier(prospecto) as number}`, prospecto, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProspecto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<any> {
    const options = createRequestOption(req);
    return this.http.get<any>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  uploadFiles(files: any, nProspecto: number): any {
    return this.http.post(`${this.resourceDocumentosUrl}/uploadfiles/${nProspecto}`, files);
  }

  deleteFile(nDocumentoProspecto: number): any {
    return this.http.delete(`${this.resourceDocumentosUrl}/deletefile/${nDocumentoProspecto}`);
  }

  getFiles(nProspecto: number): any {
    return this.http.get<any>(`${this.resourceDocumentosUrl}/documentos/${nProspecto}`, {observe: 'response'});
  }

  addProspectoToCollectionIfMissing(
    prospectoCollection: IProspecto[],
    ...prospectosToCheck: (IProspecto | null | undefined)[]
  ): IProspecto[] {
    const prospectos: IProspecto[] = prospectosToCheck.filter(isPresent);
    if (prospectos.length > 0) {
      const prospectoCollectionIdentifiers = prospectoCollection.map(prospectoItem => getProspectoIdentifier(prospectoItem)!);
      const prospectosToAdd = prospectos.filter(prospectoItem => {
        const prospectoIdentifier = getProspectoIdentifier(prospectoItem);
        if (prospectoIdentifier == null || prospectoCollectionIdentifiers.includes(prospectoIdentifier)) {
          return false;
        }
        prospectoCollectionIdentifiers.push(prospectoIdentifier);
        return true;
      });
      return [...prospectosToAdd, ...prospectoCollection];
    }
    return prospectoCollection;
  }
}
