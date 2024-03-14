jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProspectoService } from '../service/prospecto.service';

import { ProspectoDeleteDialogComponent } from './prospecto-delete-dialog.component';

describe('Component Tests', () => {
  describe('Prospecto Management Delete Component', () => {
    let comp: ProspectoDeleteDialogComponent;
    let fixture: ComponentFixture<ProspectoDeleteDialogComponent>;
    let service: ProspectoService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProspectoDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ProspectoDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProspectoDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProspectoService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
