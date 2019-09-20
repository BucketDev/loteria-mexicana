import { Component, OnInit } from '@angular/core';

import { Board } from '../../../models/board.interface';
import { BoardService } from 'src/app/providers/board.service';
import { DocumentReference } from '@angular/fire/firestore';
import { LoadingService } from 'src/app/providers/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.css']
})
export class NewBoardComponent implements OnInit {

  board: Board;

  constructor(private boardService: BoardService,
              private loadingService: LoadingService,
              private router: Router) {
    this.boardService.displayNavBar = true;
    this.board = {
      name: '',
      hostName: '',
      cardHistory: [],
      creationDate: new Date(),
      gameStarted: false,
      gameWon: false
    }
  }

  ngOnInit() { }

  createBoard = () => {
    this.loadingService.loading = true;
    this.boardService.createBoard(this.board)
      .then((data: DocumentReference) => {
        this.loadingService.loading = false;
        this.router.navigate([`/board/${data.id}/host`])
      });
  }

}
