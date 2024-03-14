import { Estatus, IEstatus } from "app/shared/models/estatus.model";

export interface IProspecto {
  nProspecto?: number;
  cNombre?: string;
  cApellidoPaterno?: string;
  cApellidoMaterno?: string | null;
  cCalle?: string;
  cNoExt?: string;
  cColonia?: string;
  cCodigoPostal?: string;
  cTelefono?: string;
  cRFC?: string;
  nEstatus?: number | null;
  bActivo?: boolean | null;
  estatus?: IEstatus | null;
  cObservacionesRechazo?: string | null;
}

export class Prospecto implements IProspecto {
  constructor(
    public nProspecto?: number,
    public cNombre?: string,
    public cApellidoPaterno?: string,
    public cApellidoMaterno?: string | null,
    public cCalle?: string,
    public cNoExt?: string,
    public cColonia?: string,
    public cCodigoPostal?: string,
    public cTelefono?: string,
    public cRFC?: string,
    public nEstatus?: number | null,
    public bActivo?: boolean | null,
    // eslint-disable-next-line @typescript-eslint/no-shadow
    public estatus?: Estatus | null,
    public cObservacionesRechazo?: string | null
  ) {
    this.bActivo = this.bActivo ?? false;
  }
}

export function getProspectoIdentifier(prospecto: IProspecto): number | undefined {
  return prospecto.nProspecto;
}
