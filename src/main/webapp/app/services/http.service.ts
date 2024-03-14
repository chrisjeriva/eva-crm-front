
// import {retry} from 'rxjs/operators';
// import { Injectable, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AppStateService } from './app-state.service';

// @Injectable()
// export class HttpService implements OnInit {


//   constructor(private http: HttpClient, private appState: AppStateService) {
//   }

//   ngOnInit(): void {

//   }

//   buildHeader(authorization?: boolean): HttpHeaders {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');

//     if (authorization) {
//       headers.set('Authorization', 'Bearer ' + this.appState.getToken());
//     }

//     return headers;
//   }

//   get(baseUri: string) {
//     const headers = this.buildHeader();
//     return this.http.get(baseUri, { headers: headers });
//   }

//   post(baseUri: string, payload: any, authorization?: boolean): Observable<object> {

//     const body = JSON.stringify(payload);
//     const headers = this.buildHeader(authorization);
//     const ob = this.http.post(baseUri, body, { headers: headers });
//     ob.pipe(retry(2));
//     return ob;
//   }

//   postGuess(baseUri: string, payload: any): Observable<object> {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     const body = JSON.stringify(payload);
//     const ob = this.http.post(baseUri, body, { headers : headers});
//     ob.pipe(retry(2));
//     return ob;
//   }
//   postFile(baseUri: string, payload: FormData): Observable<object> {
//     const body = payload;
//     const headers = new HttpHeaders();
//     headers.append('Content-Type', 'false');
//     headers.append('processData', 'false');
//     const ob = this.http.post(baseUri, body, { headers: headers });
//     ob.pipe(retry(2));
//     return ob;
//   }

//   put(baseUri: string, payload: any): Observable<Object> {
//     const body = JSON.stringify(payload);
//     const headers = this.buildHeader();
//     return this.http.put(baseUri, body, { headers: headers });
//   }

//   delete(baseUri: string): Observable<any> {
//     const headers = this.buildHeader();
//     return this.http.delete(baseUri, { headers: headers });
//   }

//   del(baseUri: string, payload: any): Observable<any> {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     headers.set('Authorization', 'Bearer ' + this.appState.getToken());
//     const options = {
//       headers: headers,
//       body: payload,
//     };

//     return this.http.delete(baseUri, options);
//   }

//   buildHeaderPDFFileReceive(authorization?: boolean): HttpHeaders {
//     const headers = new HttpHeaders().set('Content-Type', 'application/json');
//     headers.set('ResponseType', 'arraybuffer');
//     headers.set('Accept', 'application/pdf');

//     if (authorization) {
//       headers.set('Authorization', 'Bearer ' + this.appState.getToken());
//     }

//     return headers;
//   }

//   postReceivePDFFile(baseUri: string, payload: any, authorization?: boolean): Observable<object> {

//     const body = JSON.stringify(payload);
//     const headers = this.buildHeaderPDFFileReceive(authorization);
//     const ob = this.http.post(baseUri, body, { headers: headers, responseType: 'blob' });
//     ob.pipe(retry(2));
//     return ob;
//   }
// }
