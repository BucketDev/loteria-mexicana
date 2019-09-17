import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/providers/board.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  constructor(private boardService: BoardService) { }

  ngOnInit() { }

  initializeBoard = () => {
    this.boardService.createBoard()
      .then((docRef) => console.log(docRef));
  }

}
