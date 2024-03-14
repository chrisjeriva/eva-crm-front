import { element, by, ElementFinder } from 'protractor';

export class ProspectoComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-prospecto div table .btn-danger'));
  title = element.all(by.css('jhi-prospecto div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class ProspectoUpdatePage {
  pageTitle = element(by.id('jhi-prospecto-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  cNombreInput = element(by.id('field_cNombre'));
  cApellidoPaternoInput = element(by.id('field_cApellidoPaterno'));
  cApellidoMaternoInput = element(by.id('field_cApellidoMaterno'));
  cCalleInput = element(by.id('field_cCalle'));
  cNoExtInput = element(by.id('field_cNoExt'));
  cColoniaInput = element(by.id('field_cColonia'));
  cCodigoPostalInput = element(by.id('field_cCodigoPostal'));
  cTelefonoInput = element(by.id('field_cTelefono'));
  cRFCInput = element(by.id('field_cRFC'));
  nEstatusInput = element(by.id('field_nEstatus'));
  bActivoInput = element(by.id('field_bActivo'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCNombreInput(cNombre: string): Promise<void> {
    await this.cNombreInput.sendKeys(cNombre);
  }

  async getCNombreInput(): Promise<string> {
    return await this.cNombreInput.getAttribute('value');
  }

  async setCApellidoPaternoInput(cApellidoPaterno: string): Promise<void> {
    await this.cApellidoPaternoInput.sendKeys(cApellidoPaterno);
  }

  async getCApellidoPaternoInput(): Promise<string> {
    return await this.cApellidoPaternoInput.getAttribute('value');
  }

  async setCApellidoMaternoInput(cApellidoMaterno: string): Promise<void> {
    await this.cApellidoMaternoInput.sendKeys(cApellidoMaterno);
  }

  async getCApellidoMaternoInput(): Promise<string> {
    return await this.cApellidoMaternoInput.getAttribute('value');
  }

  async setCCalleInput(cCalle: string): Promise<void> {
    await this.cCalleInput.sendKeys(cCalle);
  }

  async getCCalleInput(): Promise<string> {
    return await this.cCalleInput.getAttribute('value');
  }

  async setCNoExtInput(cNoExt: string): Promise<void> {
    await this.cNoExtInput.sendKeys(cNoExt);
  }

  async getCNoExtInput(): Promise<string> {
    return await this.cNoExtInput.getAttribute('value');
  }

  async setCColoniaInput(cColonia: string): Promise<void> {
    await this.cColoniaInput.sendKeys(cColonia);
  }

  async getCColoniaInput(): Promise<string> {
    return await this.cColoniaInput.getAttribute('value');
  }

  async setCCodigoPostalInput(cCodigoPostal: string): Promise<void> {
    await this.cCodigoPostalInput.sendKeys(cCodigoPostal);
  }

  async getCCodigoPostalInput(): Promise<string> {
    return await this.cCodigoPostalInput.getAttribute('value');
  }

  async setCTelefonoInput(cTelefono: string): Promise<void> {
    await this.cTelefonoInput.sendKeys(cTelefono);
  }

  async getCTelefonoInput(): Promise<string> {
    return await this.cTelefonoInput.getAttribute('value');
  }

  async setCRFCInput(cRFC: string): Promise<void> {
    await this.cRFCInput.sendKeys(cRFC);
  }

  async getCRFCInput(): Promise<string> {
    return await this.cRFCInput.getAttribute('value');
  }

  async setNEstatusInput(nEstatus: string): Promise<void> {
    await this.nEstatusInput.sendKeys(nEstatus);
  }

  async getNEstatusInput(): Promise<string> {
    return await this.nEstatusInput.getAttribute('value');
  }

  getBActivoInput(): ElementFinder {
    return this.bActivoInput;
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ProspectoDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-prospecto-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-prospecto'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
