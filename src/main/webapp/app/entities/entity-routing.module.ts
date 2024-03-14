import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'prospecto',
        data: { pageTitle: 'Prospectos' },
        loadChildren: () => import('./prospecto/prospecto.module').then(m => m.ProspectoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
