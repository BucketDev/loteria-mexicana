import { Component, OnInit } from '@angular/core';
import { Board } from 'src/app/models/board.interface';
import { Card } from 'src/app/models/card.interface';
import { BoardService } from 'src/app/providers/board.service';
import { CardService } from 'src/app/providers/card.service';
import { LoadingService } from 'src/app/providers/loading.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlayerService } from 'src/app/providers/player.service';
import { DocumentReference } from '@angular/fire/firestore';
import { Player } from 'src/app/models/player.interface';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.css']
})
export class PlayerBoardComponent implements OnInit {

  board: Board;
  cards: Card[];
  cardsSelected: Card[] = [];
  player: Player;

  constructor(private boardService: BoardService,
              private playerService: PlayerService,
              private cardService: CardService,
              private loadingService: LoadingService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar) {
    this.boardService.displayNavBar = false;
    this.loadingService.loading = true;
    this.activatedRoute.params.subscribe(params => {
      let boardUid = params['uid'];
      this.boardService.getBoard(boardUid)
        .subscribe((board: Board) => {
          this.board = board;
          this.initializeBoard();
        });
      this.cardService.getCards()
        .subscribe((cards: Card[]) => {
          this.cards = cards;
          this.loadingService.loading = false;
          this.addPlayer(boardUid);
        });
    });
  }

  addPlayer = (boardUid: string) => {
    let player: Player = JSON.parse( localStorage.getItem('player') );
    if (!player || player.boardUid !== boardUid) {
      player = { name: 'Rodrigo Loyola', board: [], boardUid };
      this.playerService.createPlayer(boardUid, player)
        .then((data: DocumentReference) => {
          this.player = player;
          this.player.uid = data.id;
          localStorage.setItem('player', JSON.stringify(player));
          this.shuffleBoard();
      })
    } else {
      this.loadingService.loading = true;
      this.playerService.getPlayer(boardUid, player.uid).subscribe((player: Player) => {
        this.loadingService.loading = false;
        this.player = player;
      })
    }
  }

  initializeBoard = () => {
    if(!this.board.gameStarted) {
      this.cardsSelected = [];
      document.querySelectorAll('.card').forEach(element => {
        element.classList.remove('selected');
      });
    }
  }

  shuffleBoard = () => {
    let array = this.cards;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    [...this.player.board] = [...this.cards].splice(0, 16);
    this.updateCloudPlayer();
    this.snackBar.open('Se ha creado un nuevo tablero', 'Yay!', {
      duration: 1500,
    });
  }

  updateCloudPlayer = () => {
    this.loadingService.loading = true;
    this.playerService.update(this.board.uid, this.player).then(
      success =>  this.loadingService.loading = false,
      error => console.log(error)
    );
  }

  cardSelected = (card: Card, selector: HTMLElement) => {
    let found = this.board.cardHistory.some(_card => _card.uid === card.uid);
    if (found) {
      let alreadySelected = selector.classList.contains('selected');
      if (!alreadySelected) {
        selector.classList.add("selected");
        this.cardsSelected.push(card);
        if(this.gameWon()) {
          this.snackBar.open('Ganaste!', 'Yay!', {
            duration: 1500,
          });
          this.board.gameWon = true;
          this.updateCloudBoard();
        }
      }
      this.updateCloudPlayer();
    }
  }

  // TODO validate the board setup
  gameWon = () => this.cardsSelected.length === this.player.board.length;

  updateCloudBoard = () => {
    this.loadingService.loading = true;
    this.boardService.update(this.board.uid, this.board).then(
      success =>  this.loadingService.loading = false,
      error => console.log(error)
    );
  }

  ngOnInit() {
  }

}
