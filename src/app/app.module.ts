import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterialModule } from './core/modules/material/material.module';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Components
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ConfirmationDialogComponent } from './core/components/confirmation-dialog/confirmation-dialog.component';
import { SnackbarNotificationComponent } from './core/components/snackbar-notification/snackbar-notification.component';

// Services

import { ConfirmationDialogService } from './core/services/confirmation-dialog.service';
import { ThemeService } from './core/services/theme.service'

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    DashboardComponent,
    SnackbarNotificationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatSlideToggleModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationDialogService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
