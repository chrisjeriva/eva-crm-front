export interface IEstatus {
    nEstatus?: number;
    cEstatus?: string;
    bActivo?: boolean | null;
  }
  
  export class Estatus implements IEstatus {
    constructor(
      public nEstatus?: number,
      public cEstatus?: string,
      public bActivo?: boolean | null
    ) {
      this.bActivo = this.bActivo ?? true;
    }
  }
  
  export function getEstatusIdentifier(estatus: IEstatus): number | undefined {
    return estatus.nEstatus;
  }
  