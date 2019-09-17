import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MaterialModule } from 'src/app/material/material.module';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoadingComponent } from './loading/loading.component';


@NgModule({
  declarations: [
    NavBarComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatToolbarModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class SharedModule { }
