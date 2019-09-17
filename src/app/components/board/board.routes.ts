import { Routes } from '@angular/router';

import { BoardGuardService } from 'src/app/providers/board-guard.service';

import { NewBoardComponent } from './new-board/new-board.component';
import { HostBoardComponent } from './host-board/host-board.component';
import { PlayerBoardComponent } from './player-board/player-board.component';

export const BOARD_ROUTES: Routes = [
  { path: 'new', component: NewBoardComponent },
  { path: ':uid', canActivate:[ BoardGuardService ], children: [
    { path: 'host', component: HostBoardComponent },
    { path: 'player', component: PlayerBoardComponent },
    { path: '**', pathMatch: 'full', redirectTo: '/' }
  ]},
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];
