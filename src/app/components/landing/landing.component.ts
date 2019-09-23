import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/providers/board.service';
import { Card } from 'src/app/models/card.interface';
import { CardService } from 'src/app/providers/card.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  card: Card;

  constructor(private boardService: BoardService,
              private cardService: CardService) {
    this.boardService.displayNavBar = true;
    this.card = this.cardService.getCards()[Math.floor(Math.random() * (54 + 1))];
  }

  ngOnInit() {
  }

}
