import { Component, OnInit } from '@angular/core';
import { BoardService } from 'src/app/providers/board.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  showPlayButton: boolean = false;

  constructor(private boardService: BoardService,
              private router: Router,
              private location: Location) {
  }

  ngOnInit() {
    this.router.events.subscribe(() => this.showPlayButton =
      this.location.path().startsWith('/board') ? false : true);
    
  }

  initializeBoard = () => {
    this.router.navigate(["board","new"]);
  }

}
