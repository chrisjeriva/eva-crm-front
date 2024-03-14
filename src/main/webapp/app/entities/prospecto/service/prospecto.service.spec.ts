import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProspecto, Prospecto } from '../prospecto.model';

import { ProspectoService } from './prospecto.service';

describe('Service Tests', () => {
  describe('Prospecto Service', () => {
    let service: ProspectoService;
    let httpMock: HttpTestingController;
    let elemDefault: IProspecto;
    let expectedResult: IProspecto | IProspecto[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProspectoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        cNombre: 'AAAAAAA',
        cApellidoPaterno: 'AAAAAAA',
        cApellidoMaterno: 'AAAAAAA',
        cCalle: 'AAAAAAA',
        cNoExt: 'AAAAAAA',
        cColonia: 'AAAAAAA',
        cCodigoPostal: 'AAAAAAA',
        cTelefono: 0,
        cRFC: 'AAAAAAA',
        nEstatus: 0,
        bActivo: false,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Prospecto', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Prospecto()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Prospecto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            cNombre: 'BBBBBB',
            cApellidoPaterno: 'BBBBBB',
            cApellidoMaterno: 'BBBBBB',
            cCalle: 'BBBBBB',
            cNoExt: 'BBBBBB',
            cColonia: 'BBBBBB',
            cCodigoPostal: 'BBBBBB',
            cTelefono: 1,
            cRFC: 'BBBBBB',
            nEstatus: 1,
            bActivo: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Prospecto', () => {
        const patchObject = Object.assign(
          {
            cCalle: 'BBBBBB',
            cRFC: 'BBBBBB',
            nEstatus: 1,
            bActivo: true,
          },
          new Prospecto()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Prospecto', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            cNombre: 'BBBBBB',
            cApellidoPaterno: 'BBBBBB',
            cApellidoMaterno: 'BBBBBB',
            cCalle: 'BBBBBB',
            cNoExt: 'BBBBBB',
            cColonia: 'BBBBBB',
            cCodigoPostal: 'BBBBBB',
            cTelefono: 1,
            cRFC: 'BBBBBB',
            nEstatus: 1,
            bActivo: true,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Prospecto', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProspectoToCollectionIfMissing', () => {
        it('should add a Prospecto to an empty array', () => {
          const prospecto: IProspecto = { id: 123 };
          expectedResult = service.addProspectoToCollectionIfMissing([], prospecto);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(prospecto);
        });

        it('should not add a Prospecto to an array that contains it', () => {
          const prospecto: IProspecto = { id: 123 };
          const prospectoCollection: IProspecto[] = [
            {
              ...prospecto,
            },
            { id: 456 },
          ];
          expectedResult = service.addProspectoToCollectionIfMissing(prospectoCollection, prospecto);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Prospecto to an array that doesn't contain it", () => {
          const prospecto: IProspecto = { id: 123 };
          const prospectoCollection: IProspecto[] = [{ id: 456 }];
          expectedResult = service.addProspectoToCollectionIfMissing(prospectoCollection, prospecto);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(prospecto);
        });

        it('should add only unique Prospecto to an array', () => {
          const prospectoArray: IProspecto[] = [{ id: 123 }, { id: 456 }, { id: 64635 }];
          const prospectoCollection: IProspecto[] = [{ id: 123 }];
          expectedResult = service.addProspectoToCollectionIfMissing(prospectoCollection, ...prospectoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const prospecto: IProspecto = { id: 123 };
          const prospecto2: IProspecto = { id: 456 };
          expectedResult = service.addProspectoToCollectionIfMissing([], prospecto, prospecto2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(prospecto);
          expect(expectedResult).toContain(prospecto2);
        });

        it('should accept null and undefined values', () => {
          const prospecto: IProspecto = { id: 123 };
          expectedResult = service.addProspectoToCollectionIfMissing([], null, prospecto, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(prospecto);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
