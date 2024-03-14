import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProspecto } from '../prospecto.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ProspectoService } from '../service/prospecto.service';
import { ProspectoDeleteDialogComponent } from '../delete/prospecto-delete-dialog.component';
import { AlertService } from 'app/core/util/alert.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'jhi-prospecto',
  templateUrl: './prospecto.component.html',
})
export class ProspectoComponent implements OnInit {
  prospectos?: IProspecto[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected prospectoService: ProspectoService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    private alertService: AlertService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.prospectoService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<any>) => {
          this.isLoading = false;
          this.onSuccess(res.body.results, res.body.count, pageToLoad, !dontNavigate);
        },
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
  }

  ngOnInit(): void {
    this.handleNavigation();
  }

  trackId(index: number, item: IProspecto): number {
    return item.nProspecto!;
  }

  delete(prospecto: IProspecto): void {
    const modalRef = this.modalService.open(ProspectoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.prospecto = prospecto;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  rechazar(prospecto: any) : any {
    Swal.fire({
      title: "Rechazar prospecto",
      input: "textarea",
      inputLabel: "Observaciones",
      inputPlaceholder:"Capture el motivo del rechazo",
      inputValue: "",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      showConfirmButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Rechazar",
      inputValidator: (value) => {
        if (value) {
          const data = { nProspecto: prospecto.nProspecto, cObservacionesRechazo: value};
          this.prospectoService.rechazar(data).subscribe((res: any) => {
            if(res) {
              this.alertService.addAlert({
                type: 'success',
                message: 'Se rechazó el prospecto correctamente.',
              });
            } else {
              this.alertService.addAlert({
                type: 'danger',
                message: 'Ocurrió un error al rechazar al prospecto.',
              });
            }
          });
        }
      }
    });
  }

  autorizar(prospecto: any): void {
    this.prospectoService.autorizar(prospecto.nProspecto).subscribe((res: any) => {
      if(res) {
        this.alertService.addAlert({
          type: 'success',
          message: 'Se autorizó el prospecto correctamente.',
        });
      } else {
        this.alertService.addAlert({
          type: 'danger',
          message: 'Ocurrió un error al autorizar al prospecto.',
        });
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'nProspecto') {
      result.push('nProspecto');
    }
    return result;
  }

  protected handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = page !== null ? +page : 1;
      const sort = (params.get('sort') ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === 'asc';
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  protected onSuccess(data: IProspecto[] | null, totalItems: number, page: number, navigate: boolean): void {
    // this.totalItems = Number(headers.get('X-Total-Count'));
    this.totalItems = totalItems;
    this.page = page;
    if (navigate) {
      this.router.navigate(['/prospecto'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? 'asc' : 'desc'),
        },
      });
    }
    this.prospectos = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
