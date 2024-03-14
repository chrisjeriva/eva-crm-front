import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProspecto } from '../prospecto.model';
import { ProspectoService } from '../service/prospecto.service';

@Component({
  templateUrl: './prospecto-delete-dialog.component.html',
})
export class ProspectoDeleteDialogComponent {
  prospecto?: IProspecto;

  constructor(protected prospectoService: ProspectoService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.prospectoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
