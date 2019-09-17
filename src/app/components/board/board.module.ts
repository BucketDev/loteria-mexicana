import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewBoardComponent } from './new-board/new-board.component';
import { RouterModule } from '@angular/router';
import { HostBoardComponent } from './host-board/host-board.component';
import { PlayerBoardComponent } from './player-board/player-board.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    NewBoardComponent,
    HostBoardComponent,
    PlayerBoardComponent
  ],
  exports: []
})
export class BoardModule { }
