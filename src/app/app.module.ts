import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { PercentPipe, DecimalPipe } from '@angular/common';

import { MaterialModule } from './core/modules/material/material.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Core Components
import { ConfirmationDialogComponent } from './core/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotificationComponent } from './core/components/snackbar-notification/snackbar-notification.component';

// Core Services
import { ConfirmationDialogService } from './core/services/confirmation-dialog.service';
import { ThemeService } from './core/services/theme.service';

// Shared Services
import { PositionRepositoryService } from './shared/services/position-repository.service';
import { HttpErrorHandlerService } from './shared/services/http-error-handler.service';

// Shared Pipes
import { CurrencyExtendedPipe } from './shared/pipes/currency-extended.pipe'

// Shared Directives
import { AutoCompleteOffDirective } from './shared/directives/auto-complete-off.directive';

// App Features
import { DashboardComponent } from './features/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    DashboardComponent,
    SnackbarNotificationComponent,
    CurrencyExtendedPipe,
    AutoCompleteOffDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    MaterialModule,
    MatSlideToggleModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationDialogService,
    DecimalPipe,
    HttpErrorHandlerService,
    PercentPipe,
    PositionRepositoryService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
