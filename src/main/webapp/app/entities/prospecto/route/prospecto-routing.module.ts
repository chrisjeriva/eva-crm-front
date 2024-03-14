import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProspectoComponent } from '../list/prospecto.component';
import { ProspectoDetailComponent } from '../detail/prospecto-detail.component';
import { ProspectoUpdateComponent } from '../update/prospecto-update.component';
import { ProspectoRoutingResolveService } from './prospecto-routing-resolve.service';

const prospectoRoute: Routes = [
  {
    path: '',
    component: ProspectoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProspectoDetailComponent,
    resolve: {
      prospecto: ProspectoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProspectoUpdateComponent,
    resolve: {
      prospecto: ProspectoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProspectoUpdateComponent,
    resolve: {
      prospecto: ProspectoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(prospectoRoute)],
  exports: [RouterModule],
})
export class ProspectoRoutingModule {}
