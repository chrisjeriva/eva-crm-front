import { Injectable } from '@angular/core';
import { environment } from 'src/main/webapp/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApplicationConfigService {
  private endpointPrefix = '';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  environmentConfig = environment;
  setEndpointPrefix(endpointPrefix: string): void {
    this.endpointPrefix = endpointPrefix;
  }

  getEndpointFor(api: string, microservice?: string): string {
    if (microservice) {
      return `${this.endpointPrefix}services/${microservice}/${api}`;
    }
    return `${this.endpointPrefix}${api}`;
  }
}
