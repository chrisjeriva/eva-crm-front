jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProspectoService } from '../service/prospecto.service';
import { IProspecto, Prospecto } from '../prospecto.model';

import { ProspectoUpdateComponent } from './prospecto-update.component';

describe('Component Tests', () => {
  describe('Prospecto Management Update Component', () => {
    let comp: ProspectoUpdateComponent;
    let fixture: ComponentFixture<ProspectoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let prospectoService: ProspectoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProspectoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProspectoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProspectoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      prospectoService = TestBed.inject(ProspectoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const prospecto: IProspecto = { id: 456 };

        activatedRoute.data = of({ prospecto });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(prospecto));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const prospecto = { id: 123 };
        spyOn(prospectoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ prospecto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: prospecto }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(prospectoService.update).toHaveBeenCalledWith(prospecto);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const prospecto = new Prospecto();
        spyOn(prospectoService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ prospecto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: prospecto }));
        saveSubject.complete();

        // THEN
        expect(prospectoService.create).toHaveBeenCalledWith(prospecto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const prospecto = { id: 123 };
        spyOn(prospectoService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ prospecto });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(prospectoService.update).toHaveBeenCalledWith(prospecto);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
