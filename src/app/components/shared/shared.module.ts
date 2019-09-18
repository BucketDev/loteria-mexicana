import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MaterialModule } from 'src/app/material/material.module';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    NavBarComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatProgressBarModule
  ],
  exports: [
    NavBarComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
