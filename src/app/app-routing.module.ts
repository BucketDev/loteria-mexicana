import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { BOARD_ROUTES } from './components/board/board.routes';
import { NewBoardComponent } from './components/board/new-board/new-board.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'board', children: BOARD_ROUTES },
  { path: '**', pathMatch: 'full', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
