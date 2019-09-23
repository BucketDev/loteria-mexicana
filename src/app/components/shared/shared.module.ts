import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MaterialModule } from 'src/app/material/material.module';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { LoadingComponent } from './loading/loading.component';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatProgressBarModule
  ],
  declarations: [
    NavBarComponent,
    LoadingComponent,
    ChatComponent
  ],
  exports: [
    NavBarComponent,
    LoadingComponent,
    ChatComponent
  ]
})
export class SharedModule { }
