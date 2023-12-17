import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

export function getServiceTradingToolboxTradingModelerApiBaseUrl() {
  return environment.serviceTradingToolboxTradingModelerApiBaseUrl;
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] },
  { provide: 'SERVICE_API_TRADING_TOOLBOX_TRADING_MODELER_BASE_URL', useFactory: getServiceTradingToolboxTradingModelerApiBaseUrl, deps: [] }
];

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.error(err));
