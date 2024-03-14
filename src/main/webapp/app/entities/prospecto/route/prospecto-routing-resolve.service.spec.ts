jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProspecto, Prospecto } from '../prospecto.model';
import { ProspectoService } from '../service/prospecto.service';

import { ProspectoRoutingResolveService } from './prospecto-routing-resolve.service';

describe('Service Tests', () => {
  describe('Prospecto routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProspectoRoutingResolveService;
    let service: ProspectoService;
    let resultProspecto: IProspecto | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProspectoRoutingResolveService);
      service = TestBed.inject(ProspectoService);
      resultProspecto = undefined;
    });

    describe('resolve', () => {
      it('should return IProspecto returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProspecto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProspecto).toEqual({ id: 123 });
      });

      it('should return new IProspecto if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProspecto = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProspecto).toEqual(new Prospecto());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProspecto = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProspecto).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
