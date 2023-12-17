import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PercentPipe, DecimalPipe } from '@angular/common';

import { MaterialModule } from './core/modules/material/material.module';

// Core Components
import { ConfirmationDialogComponent } from './core/components/confirmation-dialog/confirmation-dialog.component';
import { EditModelDialogComponent } from './features/models/position-input-editor-dialog/position-input-editor-dialog.component';
import { ModelRenderDialogComponent as PositionRenderDialogComponent } from './features/models/position-renderer/position-renderer-dialog/position-renderer-dialog.component';
import { ScenarioFeesDialogComponent } from './features/models/position-renderer/scenario-fees-dialog/scenario-fees-dialog.component';
import { ScenarioLotsDialogComponent } from './features/models/position-renderer/scenario-lots-dialog/scenario-lots-dialog.component';
import { SnackbarNotificationComponent } from './core/components/snackbar-notification/snackbar-notification.component';

// Core Services
import { ConfirmationDialogService } from './core/services/confirmation-dialog.service';
import { ThemeService } from './core/services/theme.service';

// Shared Directives
import { AutoCompleteOffDirective } from './shared/directives/auto-complete-off.directive';

// Shared Services
import { HttpErrorHandlerService } from './shared/services/http-error-handler.service';
import { PositionInputEditorService } from './shared/services/position-input-editor.service';
import { PositionRendererService } from './shared/services/position-renderer.service';
import { PositionRepositoryService } from './shared/services/position-repository.service';

// Shared Pipes
import { CurrencyExtendedPipe } from './shared/pipes/currency-extended.pipe'

// App Features
import { DashboardComponent } from './features/dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    DashboardComponent,
    EditModelDialogComponent,
    PositionRenderDialogComponent,
    ScenarioFeesDialogComponent,
    ScenarioLotsDialogComponent,
    SnackbarNotificationComponent,
    CurrencyExtendedPipe,
    AutoCompleteOffDirective
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule
  ],
  exports: [
    ConfirmationDialogComponent
  ],
  providers: [
    ConfirmationDialogService,
    DecimalPipe,
    HttpErrorHandlerService,
    PercentPipe,
    PositionInputEditorService,
    PositionRendererService,
    PositionRepositoryService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
