import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/providers/board.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private boardService: BoardService) {
    this.boardService.displayNavBar = true;
  }

  ngOnInit() {
  }

}
