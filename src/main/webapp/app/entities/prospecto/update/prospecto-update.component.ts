import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IProspecto, Prospecto } from '../prospecto.model';
import { ProspectoService } from '../service/prospecto.service';
import { AlertService } from 'app/core/util/alert.service';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-prospecto-update',
  templateUrl: './prospecto-update.component.html',
})
export class ProspectoUpdateComponent implements OnInit {
  @ViewChild('file') inputFile!: ElementRef;
  nProspecto = 0;
  isSaving = false;
  documentos: any[] = [];
  documentosNombres: any[] = [];
  changes = false;
  agregarDocumento = false;
  editForm = this.fb.group({
    nProspecto: [],
    cNombre: [null, [Validators.required, Validators.maxLength(200)]],
    cApellidoPaterno: [null, [Validators.required, Validators.maxLength(200)]],
    cApellidoMaterno: [],
    cCalle: [null, [Validators.required]],
    cNoExt: [null, [Validators.required]],
    cColonia: [null, [Validators.required]],
    cCodigoPostal: [null, [Validators.required]],
    cTelefono: [null, [Validators.required, Validators.maxLength(10)]],
    cRFC: [null, [Validators.required]],
    nEstatus: [1],
    cEstatus: [],
    bActivo: [true],
    cNombreDocumento: [],
  });

  constructor(
    protected prospectoService: ProspectoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ prospecto }) => {
      this.updateForm(prospecto);

      if (prospecto.nProspecto) {
        this.prospectoService.getFiles(prospecto.nProspecto).subscribe((resDocs: any) => {
          if (resDocs.body.length > 0) {
            // eslint-disable-next-line no-console
            this.documentosNombres = resDocs.body;
          }
        });
      }
    });
    this.onChanges();
  }

  onChanges(): void {
    this.editForm.valueChanges.subscribe(val => {
      this.changes = true;
    });
  }

  previousState(): void {
    if (this.nProspecto > 0) {
      this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
    } else {
      this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    }
  }

  save(): void {
    this.isSaving = true;
    const prospecto = this.createFromForm();
    if (prospecto.nProspecto !== undefined) {
      this.subscribeToSaveResponse(this.prospectoService.update(prospecto));
    } else {
      if (this.documentos.length > 0) {
        // this.subscribeToSaveResponse(this.prospectoService.create(prospecto));
        this.prospectoService.create(prospecto).subscribe(
          (res: any) => {
            // enviamos los archivos
            const formData = new FormData();
            formData.append('nProspecto', res.nProspecto);
            for (let i = 0; i < this.documentos.length; i++) {
              formData.append('files', this.documentos[i]);
              formData.append('fileNames', this.documentosNombres[i].cDocumento);
            }

            this.prospectoService.uploadFiles(formData, res.nProspecto).subscribe((resDocs: any) => {
              if (resDocs) {
                this.isSaving = false;
                this.previousState();
              }
            });
          },
          (error: any) => {
            this.isSaving = false;
            this.alertService.addAlert({
              type: 'danger',
              message: 'Ocurrió un error al guardar el prospecto.',
            });
          }
        );
      } else {
        this.isSaving = false;
        this.alertService.addAlert({
          type: 'danger',
          message: 'Es necesario agregar 1 ó mas documentos.',
        });
      }
    }
  }

  showAgregarDocumento(): void {
    this.agregarDocumento = true;
  }

  hideAgregarDocumento(): void {
    this.agregarDocumento = false;
  }

  selectFile(): any {
    this.inputFile.nativeElement.click();
  }

  onFileSelected(file: any): void {
    if (this.nProspecto > 0) {
      const formData = new FormData();
      const nameParts = file.target.files[0].name.split('.');
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const newNameFile = this.editForm.get(['cNombreDocumento'])!.value + '.' + nameParts[nameParts.length - 1];

      formData.append('files', file.target.files[0]);
      formData.append('fileNames', newNameFile);
      this.prospectoService.uploadFiles(formData, this.nProspecto).subscribe((res: any) => {
        if (res !== null && res > 0) {
          this.documentos.push(file.target.files[0]);
          this.documentosNombres.push({ nDocumentoProspecto: res, cDocumento: newNameFile, cUri: '' });
          this.inputFile.nativeElement.value = '';
          this.editForm.controls.cNombreDocumento.setValue('');
          this.hideAgregarDocumento();
        }
      });
    } else {
      const nameParts = file.target.files[0].name.split('.');
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const newNameFile = this.editForm.get(['cNombreDocumento'])!.value + '.' + nameParts[nameParts.length - 1];
      this.documentos.push(file.target.files[0]);
      this.documentosNombres.push({ nDocumentoProspecto: this.documentos.length, cDocumento: newNameFile, cUri: '' });
      this.inputFile.nativeElement.value = '';
      this.editForm.controls.cNombreDocumento.setValue('');
      this.hideAgregarDocumento();
    }
  }

  eliminarDocumento(index: number, nDocumentoProspecto: number): void {
    if (this.nProspecto > 0) {
      this.prospectoService.deleteFile(nDocumentoProspecto).subscribe((res: any) => {
        if (res) {
          this.documentosNombres.splice(index, 1);
        }
      });
    } else {
      this.documentos.splice(index, 1);
      this.documentosNombres.splice(index, 1);
    }
  }

  descargar(documento: any): any {
    // const blobUrl = window.URL.createObjectURL(this.b64toBlob(documento.cDocumentoB64, documento.cDocumentoB64.split(':')[1].split(';')[0]));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = documento.cDocumentoB64;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    link.setAttribute('download', documento.cDocumento);
    document.body.appendChild(link);
    link.click();
  }

  sanitize(uri: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(uri);
  }

  salir(): any {
    if (this.changes) {
      Swal.fire({
        icon: 'question',
        title: 'Si usted sale de la pantalla se perderá la información capturada, ¿Desea salir?',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Salir',
      }).then(result => {
        if (result.isConfirmed) {
          this.previousState();
        }
      });
    } else {
      this.previousState();
    }
  }

  protected b64toBlob(b64Data: string, contentType: string = ''): any {
    const sliceSize = 1024;
    const byteCharacters = atob(b64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProspecto>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(prospecto: IProspecto): void {
    this.nProspecto = prospecto.nProspecto ?? 0;
    this.editForm.patchValue({
      nProspecto: prospecto.nProspecto,
      cNombre: prospecto.cNombre,
      cApellidoPaterno: prospecto.cApellidoPaterno,
      cApellidoMaterno: prospecto.cApellidoMaterno,
      cCalle: prospecto.cCalle,
      cNoExt: prospecto.cNoExt,
      cColonia: prospecto.cColonia,
      cCodigoPostal: prospecto.cCodigoPostal,
      cTelefono: prospecto.cTelefono,
      cRFC: prospecto.cRFC,
      nEstatus: prospecto.nEstatus,
      cEstatus: prospecto.estatus?.cEstatus,
      bActivo: prospecto.bActivo,
    });
  }

  protected createFromForm(): IProspecto {
    return {
      ...new Prospecto(),
      nProspecto: this.editForm.get(['nProspecto'])!.value,
      cNombre: this.editForm.get(['cNombre'])!.value,
      cApellidoPaterno: this.editForm.get(['cApellidoPaterno'])!.value,
      cApellidoMaterno: this.editForm.get(['cApellidoMaterno'])!.value,
      cCalle: this.editForm.get(['cCalle'])!.value,
      cNoExt: this.editForm.get(['cNoExt'])!.value,
      cColonia: this.editForm.get(['cColonia'])!.value,
      cCodigoPostal: this.editForm.get(['cCodigoPostal'])!.value,
      cTelefono: this.editForm.get(['cTelefono'])!.value,
      cRFC: this.editForm.get(['cRFC'])!.value,
      nEstatus: this.editForm.get(['nEstatus'])!.value ?? 1,
      bActivo: true,
    };
  }
}
