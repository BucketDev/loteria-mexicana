import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoadingService } from 'src/app/providers/loading.service';
import { BoardService } from 'src/app/providers/board.service';
import { CardService } from 'src/app/providers/card.service';

import { Board } from 'src/app/models/board.interface';
import { Card } from 'src/app/models/card.interface';
import { Player } from 'src/app/models/player.interface';
import { CardHistoryComponent } from './card-history/card-history.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { PlayerNameComponent } from './player-name/player-name.component';
import { PlayerService } from 'src/app/providers/player.service';
import { CardHistoryService } from 'src/app/providers/card-history.service';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent implements OnInit {

  @Input() board: Board;
  @Input() players: Player[];
  cardHistory: Card[];

  cards: Card[];
  player: Player;

  constructor(private boardService: BoardService,
              private playerService: PlayerService,
              private cardHistoryService: CardHistoryService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private location: Location,
              private bottomSheet: MatBottomSheet,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.boardService.displayNavBar = false;
    this.cards = this.cardService.getCards();
  }

  ngOnInit(): void {
    if (!this.location.path().endsWith('/host'))
      this.activatedRoute.params.subscribe(params => {
        this.boardService.get(params['uid'])
          .subscribe((board: Board) => {
            this.board = board;
            this.initializeBoard();
            this.loadingService.loading = false;
          });
        this.cardHistoryService.get(params['uid'])
          .subscribe((cards: Card[]) => {
            this.cardHistory = cards;
            this.player && this.showHistory(true);
          });
        this.playerService.get(params['uid']).subscribe((players: Player[]) => this.players = players)
        this.initializePlayer(params['uid']);
      });
    else {
      this.cardHistoryService.get(this.board.uid)
        .subscribe((cards: Card[]) => {
          this.cardHistory = cards;
          this.player && this.showHistory(true);
        });
      this.initializePlayer(this.board.uid);
      this.shuffleBoard();
    }
  }

  initializePlayer = (uid: string) => {
    let player = JSON.parse( localStorage.getItem('player') );
    !player || player.boardUid !== uid ?
      this.createPlayer() : this.player = player;
  }

  createPlayer = () => {
    const dialogRef = this.dialog.open(PlayerNameComponent, { disableClose: true, data: { name: '' } });
    dialogRef.afterClosed().subscribe(result => {
      this.player = {
        boardUid: this.board.uid,
        name: result
      }
      this.shuffleBoard();
      this.playerService.post(this.board.uid, this.player)
        .then((data: DocumentReference) => {
          this.player.uid = data.id;
          localStorage.setItem('player', JSON.stringify(this.player));
        });
    });
  }

  updateName = () => {
    const dialogRef = this.dialog.open(PlayerNameComponent, { disableClose: true, data: { name: this.player.name } });
    dialogRef.afterClosed().subscribe(result => {
      this.player.name = result;
      this.playerService.put(this.board.uid, this.player)
        .then(
          () => localStorage.setItem('player', JSON.stringify(this.player)),
          (error) => alert(console.error())
        );
    });
  }

  initializeBoard = () => {
    if(this.player && !this.board.gameStarted) {
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
    let found = this.cardHistory.some(_card => _card.cardNumber === card.cardNumber);
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

  createCloudPlayer = () => {
    this.loadingService.loading = true;
    this.playerService.post(this.board.uid, this.player).then(
      () =>  this.loadingService.loading = false,
      error => alert(error)
    )
  }

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.put(this.board).then(
      () =>  this.loadingService.loading = false,
      error => alert(error)
    );
  }

  showHistory = (lastCards: boolean = false) => {
    console.log(this.cardHistory);
    
    if (this.cardHistory.length > 0)
      this.bottomSheet.open(CardHistoryComponent, {
        data: {
          cardHistory: [...this.cardHistory],
          lastCards
        }
      });
  }

}
