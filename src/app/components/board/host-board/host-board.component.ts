import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { BoardService } from 'src/app/providers/board.service';
import { Board } from 'src/app/models/board.interface';
import { CardService } from 'src/app/providers/card.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { Card } from 'src/app/models/card.interface';

@Component({
  selector: 'app-host-board',
  templateUrl: './host-board.component.html',
  styleUrls: ['./host-board.component.css']
})
export class HostBoardComponent implements OnInit {

  board: Board;
  cards: Card[];
  playingCards: Card[];

  constructor(private boardService: BoardService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar) {
    this.loadingService.loading = true;
    this.activatedRoute.params.subscribe(params => {
      this.boardService.getBoard(params['uid'])
        .subscribe((board: Board) => {
          console.log(board);
          this.board = board;
          !this.cards && this.cardService.getCards()
            .subscribe((cards: Card[]) => {
              this.cards = cards;
              this.initializeDeck();
              this.loadingService.loading = false;
            });
        });
    });
  }

  initializeDeck = () => {
    if (this.board.gameStarted) {
      this.playingCards = this.board.currentDeck;
      this.playingCards = this.playingCards.filter(card => {
        return !this.board.cardHistory.find(historyCard => {
          return historyCard.uid === card.uid;
        })
      })
      this.playingCards.push({
        number: 0,
        url: '/assets/img/back.jpg'
      })
    }
  }

  shuffleDeck = (cloudSave: boolean = true) => {
    if (this.playingCards[this.playingCards.length - 1].number === 0)
      this.playingCards.pop();
    let array = this.playingCards;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    [...this.board.currentDeck] = [...this.playingCards];
    cloudSave && this.updateCloudBoard();
    this.snackBar.open('Se ha mezclado la baraja', 'Yay!', {
      duration: 1500,
    });
    this.playingCards.push({
      number: 0,
      url: '/assets/img/back.jpg'
    })
  }

  startGame = () => {
    [...this.playingCards] = [...this.cards];
    this.shuffleDeck(false);
    this.board.gameStarted = true;
    this.board.cardHistory = [];
    this.updateCloudBoard();
  }

  nextCard = () => {
    let card = this.playingCards.pop();
    if (this.playingCards.length > 0) {
      this.board.cardHistory.push(this.playingCards[this.playingCards.length - 1]);
      this.updateCloudBoard();
    }
  }

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.update(this.board.uid, this.board).then(
      success =>  this.loadingService.loading = false,
      error => console.log(error)
    );
  }

  calculateRest = () => this.playingCards.length === 0 ? `0/${this.cards.length}` : `${this.playingCards.length - 1}/${this.cards.length}`

  ngOnInit() { }

  copyToClipboard = () => {
    let url = `localhost:4200/board/${this.board.uid}/player`;
    let _this = this;
    navigator.clipboard.writeText(url).then(function() {
      _this.snackBar.open('El link se copio a tu clipboard', 'Yay!', {
        duration: 3000,
      });
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

}
