import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NewBoardComponent } from './new-board/new-board.component';
import { RouterModule } from '@angular/router';
import { HostBoardComponent } from './host-board/host-board.component';
import { PlayerBoardComponent } from './player-board/player-board.component';
import { MaterialModule } from 'src/app/material/material.module';
import { SettingsBoardComponent } from './settings-board/settings-board.component';
import { CardHistoryComponent } from './player-board/card-history/card-history.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PlayerNameComponent } from './player-board/player-name/player-name.component';
import { SharedModule } from '../shared/shared.module';
import { SharedPipeModule } from 'src/app/pipes/shared-pipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    MatProgressBarModule,
    SharedModule,
    SharedPipeModule
  ],
  declarations: [
    NewBoardComponent,
    HostBoardComponent,
    PlayerBoardComponent,
    SettingsBoardComponent,
    CardHistoryComponent,
    PlayerNameComponent
  ],
  exports: [],
  entryComponents: [
    SettingsBoardComponent,
    CardHistoryComponent,
    PlayerNameComponent
  ]
})
export class BoardModule { }
