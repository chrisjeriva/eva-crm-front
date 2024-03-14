import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProspecto, Prospecto } from '../prospecto.model';
import { ProspectoService } from '../service/prospecto.service';

@Injectable({ providedIn: 'root' })
export class ProspectoRoutingResolveService implements Resolve<IProspecto> {
  constructor(protected service: ProspectoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProspecto> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((prospecto: HttpResponse<Prospecto>) => {
          if (prospecto.body) {
            return of(prospecto.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Prospecto());
  }
}
