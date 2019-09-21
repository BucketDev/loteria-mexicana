import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import 'hammerjs';

import { BoardService } from 'src/app/providers/board.service';
import { Board } from 'src/app/models/board.interface';
import { CardService } from 'src/app/providers/card.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { Card } from 'src/app/models/card.interface';
import { environment } from '../../../../environments/environment';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SettingsBoardComponent } from '../settings-board/settings-board.component';
import { Player } from 'src/app/models/player.interface';
import { PlayerService } from 'src/app/providers/player.service';

@Component({
  selector: 'app-host-board',
  templateUrl: './host-board.component.html',
  styleUrls: ['./host-board.component.css']
})
export class HostBoardComponent implements OnInit {

  board: Board;
  players: Player[];
  cards: Card[];
  playingCards: Card[] = [];

  constructor(private boardService: BoardService,
              private playersService: PlayerService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private bottomSheet: MatBottomSheet) {
    this.boardService.displayNavBar = false;
    this.loadingService.loading = true;
    
    this.activatedRoute.params.subscribe(params => {
      this.boardService.getBoard(params['uid'])
        .subscribe((board: Board) => {
          this.board = board;
          this.initializeDeck();
          this.loadingService.loading = false;
        });
      this.playersService.getPlayers(params['uid']).subscribe((players: Player[]) => this.players = players);
    });
  }

  initializeDeck = () => {
    this.cards = this.cardService.getCards();
    if (this.board.gameStarted) {
      this.playingCards = JSON.parse(localStorage.getItem('playingCards'));
    }
  }

  startGame = () => {
    [...this.playingCards] = [...this.cards];
    this.shuffleDeck();
    this.board.gameStarted = true;
    this.board.gameWon = false;
    this.board.cardHistory = [this.playingCards[this.playingCards.length -1]];
    this.updateCloudBoard();
  }

  nextCard = () => {
    this.playingCards.pop();
    localStorage.setItem('playingCards', JSON.stringify(this.playingCards));
    if (this.playingCards.length > 0) {
      this.board.cardHistory.push(this.playingCards[this.playingCards.length - 1]);
      this.updateCloudBoard();
    }
  }
  
  finishGame = () => {
    this.board.gameStarted = false;
    this.board.winners = [];
    this.board.cardHistory = [];
    this.updateCloudBoard();
  }

  shuffleDeck = () => {
    let array = this.playingCards;
    let length = this.board.gameStarted ? array.length - 2 : array.length - 1
    for (let i = length; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    localStorage.setItem('playingCards', JSON.stringify(this.playingCards));
    this.snackBar.open('Se ha mezclado la baraja', '', {
      duration: 1500,
    });
  }

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.update(this.board).then(
      success =>  this.loadingService.loading = false,
      error => console.log(error)
    );
  }

  calculateRest = () => `${this.playingCards.length}/${this.cards.length}`;

  getWinners = () => this.board.winners.join(', ')

  ngOnInit() { }

  copyAndShare = () => {
    let url = `${environment.endpointURL}/board/${this.board.uid}/player`;
    let _this = this;
    if (window.navigator && window.navigator['share']) {
      window.navigator['share']({
        title: 'WebShare API Demo',
        url
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(function() {
        _this.snackBar.open('Se copió el enlace con éxito', '', {
          duration: 3000,
        });
      }, function(err) {
        console.error('Async: Could not copy text: ', err);
      });
    }
  }

  openSettings = () => {
    let ref = this.bottomSheet.open(SettingsBoardComponent, {
      data: {}
    });
    /*ref.afterDismissed().subscribe((data: MatchParticipants) => {
      if (data !== undefined) {
        this.matches = this.matches
          .map((_match: MatchParticipants) => (_match.id === data.id) ? data : _match);
        this.snackBar.open('The match has been saved correctly', 'Okay!', {
            duration: 2000,
            horizontalPosition: 'right'
          });
      }
    });*/
  }

}
