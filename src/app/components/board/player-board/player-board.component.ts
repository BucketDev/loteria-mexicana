import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoadingService } from 'src/app/providers/loading.service';
import { BoardService } from 'src/app/providers/board.service';
import { CardService } from 'src/app/providers/card.service';

import { Board } from 'src/app/models/board.interface';
import { Card } from 'src/app/models/card.interface';
import { Player } from 'src/app/models/player.interface';
import { CardHistoryComponent } from './card-history.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PlayerNameComponent } from './player-name.component';
import { PlayerService } from 'src/app/providers/player.service';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent {

  board: Board;
  cards: Card[];
  player: Player;

  constructor(private boardService: BoardService,
              private playerService: PlayerService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.boardService.displayNavBar = false;
    this.loadingService.loading = true;
    
    this.cards = this.cardService.getCards();
    
    this.activatedRoute.params.subscribe(params => {
      this.addPlayer(params['uid']);
      let boardUid = params['uid'];
      this.boardService.getBoard(boardUid)
        .subscribe((board: Board) => {
          //TODO try to split the card history into another collection
          let show = false;
          if(this.board && this.board.cardHistory.length < board.cardHistory.length) {
            show = true;
          }
          this.board = board;
          show && this.showHistory(true);
          !this.board.gameStarted && this.initializeBoard();
          this.loadingService.loading = false;
        });
    });
  }

  addPlayer = (uid: string) => {
    let player: Player = JSON.parse( localStorage.getItem('player') );
    if (!player || player.boardUid !== uid) {
      this.updateName();
    } else {
      this.player = player;
    }
  }

  updateName = () => {
    const dialogRef = this.dialog.open(PlayerNameComponent, { disableClose: true, data: { name: '' } });
    dialogRef.afterClosed().subscribe(result => {
      this.player = {
        name: result,
        boardUid: this.board.uid,
        playerBoard: []
      }
      this.shuffleBoard();
      this.playerService.createPlayer(this.board.uid, this.player)
        .then((data: DocumentReference) => {
          this.player.uid = data.id;
          localStorage.setItem('player', JSON.stringify(this.player));
        });
    });
  }

  initializeBoard = () => {
    if(this.player) {
      this.player.playerBoard.forEach(card => card.selected = false);
      localStorage.setItem('player', JSON.stringify(this.player));
    }
  }

  shuffleBoard = () => {
    let array = this.cards;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    [...this.player.playerBoard] = [...this.cards].splice(0, 16);
    localStorage.setItem('player', JSON.stringify(this.player));
    this.snackBar.open('Se ha creado un nuevo tablero', '', {
      duration: 1500,
    });
  }

  cardSelected = (card: Card) => {
    let found = this.board.cardHistory.some(_card => _card.uid === card.uid);
    if (found) {
      if (!card.selected) {
        card.selected = true;
        if(!this.board.gameWon && this.gameWon()) {
          this.board.gameWon = true;
          this.board.winners.push(this.player.name);
          this.updateCloudBoard();
          this.snackBar.open('Ganaste!', 'Yay!', {
            duration: 1500,
          });
        }
      }
      localStorage.setItem('player', JSON.stringify(this.player));
    }
  }

  // TODO validate the board setup
  gameWon = () => this.player.playerBoard
    .reduce((total, card) => total + (card.selected ? 1 : 0), 0) === this.player.playerBoard.length;
  
    getWinners = () => this.board.winners.join(', ');

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.update(this.board).then(
      success =>  this.loadingService.loading = false,
      error => console.log(error)
    );
  }

  showHistory = (lastCards: boolean = false) => {
    let ref = this.bottomSheet.open(CardHistoryComponent, {
      data: {
        cardHistory: [...this.board.cardHistory],
        lastCards
      }
    });
  }

}
