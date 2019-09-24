import { Component, OnInit } from '@angular/core';

import { Board } from '../../../models/board.interface';
import { BoardService } from 'src/app/providers/board.service';
import { DocumentReference } from '@angular/fire/firestore';
import { LoadingService } from 'src/app/providers/loading.service';
import { Router } from '@angular/router';
import { PlayerService } from 'src/app/providers/player.service';
import { CardHistoryService } from 'src/app/providers/card-history.service';
import { Player } from 'src/app/models/player.interface';

@Component({
  selector: 'app-new-board',
  templateUrl: './new-board.component.html',
  styleUrls: ['./new-board.component.css']
})
export class NewBoardComponent implements OnInit {

  board: Board;

  constructor(private boardService: BoardService,
              private playerService: PlayerService,
              private cardHistoryService: CardHistoryService,
              private loadingService: LoadingService,
              private router: Router) {
    this.boardService.displayNavBar = true;
    this.board = {
      name: '',
      hostName: '',
      creationDate: new Date(),
      gameStarted: false,
      gameWon: false,
      winners: []
    }
  }

  ngOnInit() { }

  createBoard = () => {
    this.loadingService.loading = true;
    this.boardService.post(this.board)
      .then((board: DocumentReference) => {
        this.board.uid = board.id;
        let player: Player = { name: this.board.hostName, boardUid: board.id }
        localStorage.setItem('player', JSON.stringify(player));
        this.loadingService.loading = false;
        this.router.navigate([`/board/${this.board.uid}/host`])
      });
  }

}
