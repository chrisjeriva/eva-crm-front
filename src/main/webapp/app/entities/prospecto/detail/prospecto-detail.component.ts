import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IProspecto } from '../prospecto.model';
import { ProspectoService } from '../service/prospecto.service';
import { AlertService } from 'app/core/util/alert.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'jhi-prospecto-detail',
  templateUrl: './prospecto-detail.component.html',
})
export class ProspectoDetailComponent implements OnInit {
  prospecto: IProspecto | null = null;
  documentosNombres: any[] = [];
  hideButtons = false;
  constructor(protected activatedRoute: ActivatedRoute, 
              private prospectoService: ProspectoService,
              private alertService: AlertService,
              private router: Router) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prospecto }) => {
      this.prospecto = prospecto;

      if(prospecto.nProspecto) {
        this.prospectoService.getFiles(prospecto.nProspecto).subscribe((resDocs: any) => {
          if(resDocs.body.length > 0) {
            // eslint-disable-next-line no-console
            this.documentosNombres = resDocs.body;
          } else {
            this.alertService.addAlert({
              type: 'danger',
              message: 'El prospecto no tiene documentos, no es posible Autorizar o Rechazar.',
            });
          }
        })
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  rechazar() : any {
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
          const data = { nProspecto: this.prospecto?.nProspecto, cObservacionesRechazo: value};
          this.prospectoService.rechazar(data).subscribe((res: any) => {
            if(res) {
              this.hideButtons = true;
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

          return "";
        } else {
          return "Es necesario agregar observaciones";
        }
      }
    });
  }

  autorizar(): void {
    this.prospectoService.autorizar(this.prospecto?.nProspecto ?? 0).subscribe((res: any) => {
      if(res) {
        this.hideButtons = true;
        this.alertService.addAlert({
          type: 'success',
          message: 'Se autorizó el prospecto correctamente.',
        });
        setTimeout(() => {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        }, 1000);
      } else {
        this.alertService.addAlert({
          type: 'danger',
          message: 'Ocurrió un error al autorizar al prospecto.',
        });
      }
    });
  }

  descargar(documento: any): any {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = documento.cDocumentoB64;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    link.setAttribute('download', documento.cDocumento);
    document.body.appendChild(link);
    link.click();
  }
}
