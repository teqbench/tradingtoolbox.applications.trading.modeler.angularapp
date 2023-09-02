/*
* Module to managing importing all of the Material controls, etc. in a central location.
*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';

const materialModules = [
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatTooltipModule
];

@NgModule({
  imports: [
    CommonModule,
    ...materialModules
  ],
  exports: [
    ...materialModules
  ]
})
export class MaterialModule { }
