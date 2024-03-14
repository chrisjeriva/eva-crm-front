import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ProspectoComponentsPage, ProspectoDeleteDialog, ProspectoUpdatePage } from './prospecto.page-object';

const expect = chai.expect;

describe('Prospecto e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let prospectoComponentsPage: ProspectoComponentsPage;
  let prospectoUpdatePage: ProspectoUpdatePage;
  let prospectoDeleteDialog: ProspectoDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Prospectos', async () => {
    await navBarPage.goToEntity('prospecto');
    prospectoComponentsPage = new ProspectoComponentsPage();
    await browser.wait(ec.visibilityOf(prospectoComponentsPage.title), 5000);
    expect(await prospectoComponentsPage.getTitle()).to.eq('Prospectos');
    await browser.wait(ec.or(ec.visibilityOf(prospectoComponentsPage.entities), ec.visibilityOf(prospectoComponentsPage.noResult)), 1000);
  });

  it('should load create Prospecto page', async () => {
    await prospectoComponentsPage.clickOnCreateButton();
    prospectoUpdatePage = new ProspectoUpdatePage();
    expect(await prospectoUpdatePage.getPageTitle()).to.eq('Create or edit a Prospecto');
    await prospectoUpdatePage.cancel();
  });

  it('should create and save Prospectos', async () => {
    const nbButtonsBeforeCreate = await prospectoComponentsPage.countDeleteButtons();

    await prospectoComponentsPage.clickOnCreateButton();

    await promise.all([
      prospectoUpdatePage.setCNombreInput('cNombre'),
      prospectoUpdatePage.setCApellidoPaternoInput('cApellidoPaterno'),
      prospectoUpdatePage.setCApellidoMaternoInput('cApellidoMaterno'),
      prospectoUpdatePage.setCCalleInput('cCalle'),
      prospectoUpdatePage.setCNoExtInput('cNoExt'),
      prospectoUpdatePage.setCColoniaInput('cColonia'),
      prospectoUpdatePage.setCCodigoPostalInput('cCodigoPostal'),
      prospectoUpdatePage.setCTelefonoInput('5'),
      prospectoUpdatePage.setCRFCInput('cRFC'),
      prospectoUpdatePage.setNEstatusInput('5'),
    ]);

    expect(await prospectoUpdatePage.getCNombreInput()).to.eq('cNombre', 'Expected CNombre value to be equals to cNombre');
    expect(await prospectoUpdatePage.getCApellidoPaternoInput()).to.eq(
      'cApellidoPaterno',
      'Expected CApellidoPaterno value to be equals to cApellidoPaterno'
    );
    expect(await prospectoUpdatePage.getCApellidoMaternoInput()).to.eq(
      'cApellidoMaterno',
      'Expected CApellidoMaterno value to be equals to cApellidoMaterno'
    );
    expect(await prospectoUpdatePage.getCCalleInput()).to.eq('cCalle', 'Expected CCalle value to be equals to cCalle');
    expect(await prospectoUpdatePage.getCNoExtInput()).to.eq('cNoExt', 'Expected CNoExt value to be equals to cNoExt');
    expect(await prospectoUpdatePage.getCColoniaInput()).to.eq('cColonia', 'Expected CColonia value to be equals to cColonia');
    expect(await prospectoUpdatePage.getCCodigoPostalInput()).to.eq(
      'cCodigoPostal',
      'Expected CCodigoPostal value to be equals to cCodigoPostal'
    );
    expect(await prospectoUpdatePage.getCTelefonoInput()).to.eq('5', 'Expected cTelefono value to be equals to 5');
    expect(await prospectoUpdatePage.getCRFCInput()).to.eq('cRFC', 'Expected CRFC value to be equals to cRFC');
    expect(await prospectoUpdatePage.getNEstatusInput()).to.eq('5', 'Expected nEstatus value to be equals to 5');
    const selectedBActivo = prospectoUpdatePage.getBActivoInput();
    if (await selectedBActivo.isSelected()) {
      await prospectoUpdatePage.getBActivoInput().click();
      expect(await prospectoUpdatePage.getBActivoInput().isSelected(), 'Expected bActivo not to be selected').to.be.false;
    } else {
      await prospectoUpdatePage.getBActivoInput().click();
      expect(await prospectoUpdatePage.getBActivoInput().isSelected(), 'Expected bActivo to be selected').to.be.true;
    }

    await prospectoUpdatePage.save();
    expect(await prospectoUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await prospectoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Prospecto', async () => {
    const nbButtonsBeforeDelete = await prospectoComponentsPage.countDeleteButtons();
    await prospectoComponentsPage.clickOnLastDeleteButton();

    prospectoDeleteDialog = new ProspectoDeleteDialog();
    expect(await prospectoDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Prospecto?');
    await prospectoDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(prospectoComponentsPage.title), 5000);

    expect(await prospectoComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
