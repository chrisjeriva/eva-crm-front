import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProspectoComponent } from './list/prospecto.component';
import { ProspectoDetailComponent } from './detail/prospecto-detail.component';
import { ProspectoUpdateComponent } from './update/prospecto-update.component';
import { ProspectoDeleteDialogComponent } from './delete/prospecto-delete-dialog.component';
import { ProspectoRoutingModule } from './route/prospecto-routing.module';

@NgModule({
  imports: [SharedModule, ProspectoRoutingModule],
  declarations: [ProspectoComponent, ProspectoDetailComponent, ProspectoUpdateComponent, ProspectoDeleteDialogComponent],
  entryComponents: [ProspectoDeleteDialogComponent],
})
export class ProspectoModule {}
