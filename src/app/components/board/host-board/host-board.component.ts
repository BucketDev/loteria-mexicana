import { Component, ViewChild } from '@angular/core';
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
import { CardHistoryService } from 'src/app/providers/card-history.service';
import { interval, Subscription } from 'rxjs';
import { PlayerBoardComponent } from '../player-board/player-board.component';

@Component({
  selector: 'app-host-board',
  templateUrl: './host-board.component.html',
  styleUrls: ['./host-board.component.css']
})
export class HostBoardComponent {

  board: Board;
  players: Player[];
  cardHistory: Card[];
  
  cards: Card[];
  playingCards: Card[] = [];
  sub: Subscription;

  @ViewChild(PlayerBoardComponent, { static: false }) playerBoard: PlayerBoardComponent;
  autoPilot: boolean = false;
  timeLapse: number = 3;

  constructor(private boardService: BoardService,
              private playersService: PlayerService,
              private cardHistoryService: CardHistoryService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              private bottomSheet: MatBottomSheet) {
    this.boardService.displayNavBar = false;
    this.cards = this.cardService.getCards();
    this.playingCards = JSON.parse(localStorage.getItem('playingCards'));

    this.activatedRoute.params.subscribe(params => {
      this.boardService.get(params['uid']).subscribe((board: Board) => this.board = board);
      this.playersService.get(params['uid']).subscribe((players: Player[]) => this.players = players);
    });
  }

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.put(this.board).then(
      () =>  this.loadingService.loading = false,
      error => alert(error)
    );
  }

  addCardCloudCardHistory = () => {
    let length = this.playingCards.length - 1;
    let card: Card = {
      order: length,
      ...this.playingCards[length]
    }
    this.loadingService.loading = true;
    this.cardHistoryService.put(this.board.uid, card).then(
      () =>  this.loadingService.loading = false,
      error => alert(error)
    );
  }

  startGame = () => {
    [...this.playingCards] = [...this.cards];
    this.shuffleDeck();
    this.board.gameStarted = true;
    this.board.gameWon = false;
    this.updateCloudBoard();
    this.addCardCloudCardHistory();
  }

  nextCard = () => {
    this.playingCards.pop();
    localStorage.setItem('playingCards', JSON.stringify(this.playingCards));
    if (this.playingCards.length > 0) {
      this.addCardCloudCardHistory();
    }
  }
  
  finishGame = () => {
    this.board.gameStarted = false;
    this.board.winners = [];
    this.updateCloudBoard();
    this.cardHistoryService.delete(this.board.uid);
    this.autoPilot = false;
    this.sub && this.sub.unsubscribe();
  }

  enableAutoPilot = () => {
    this.autoPilot = true;
    this.startGame();
    const timer$ = interval(1000);
    this.sub = timer$.subscribe((sec) => {
      if (sec > 0 && sec % this.timeLapse === 0) {
        this.nextCard();
        if (this.playingCards.length === 0)
          this.sub.unsubscribe();
      }
    });
  }

  shuffleDeck = () => {
    let array = this.playingCards;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    localStorage.setItem('playingCards', JSON.stringify(this.playingCards));
  }

  calculateRest = () => `${this.playingCards.length}/${this.cards.length}`;

  getWinners = () => this.board.winners.join(', ');
  
  getPlayers = () => this.players.map((player: Player) => player.name).join(', ');

  canShare = () => window.navigator && window.navigator['share'];

  copyAndShare = () => {
    let url = `${environment.endpointURL}/board/${this.board.uid}/player`;
    let _this = this;
    if ( this.canShare() ) {
      window.navigator['share']({
        title: 'Comparte lotería mexicana con tus amigos y familia',
        url
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch(console.error);
    } else {
      var dummy = document.createElement("input");
      document.body.appendChild(dummy);
      dummy.setAttribute("id", "dummy_id");
      (<HTMLInputElement> document.getElementById("dummy_id")).value = url;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);

      _this.snackBar.open('Se copió el enlace con éxito', '', {
        duration: 3000,
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
