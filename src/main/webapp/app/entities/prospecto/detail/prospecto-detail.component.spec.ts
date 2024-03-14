import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProspectoDetailComponent } from './prospecto-detail.component';

describe('Component Tests', () => {
  describe('Prospecto Management Detail Component', () => {
    let comp: ProspectoDetailComponent;
    let fixture: ComponentFixture<ProspectoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProspectoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ prospecto: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProspectoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProspectoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load prospecto on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.prospecto).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
