import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Card } from 'src/app/models/card.interface';
import { interval } from 'rxjs';

@Component({
  selector: 'app-card-history',
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.css']
})
export class CardHistoryComponent implements OnInit {

  cardHistory: Card[];
  progressbarValue = 0;
  curSec: number = 0;
  timeLapse: number = 3;

  constructor(private bottomSheetRef: MatBottomSheetRef<CardHistoryComponent>,
              private _changeDetectorRef: ChangeDetectorRef,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
                cardHistory: Card[],
                lastCards: boolean
              }) {
    this.cardHistory = data.lastCards ? data.cardHistory.splice(-10,10) : data.cardHistory;
    bottomSheetRef.afterOpened().subscribe(() =>
      document.querySelector('.card-history-container').scrollLeft = this.cardHistory.length * (110 - 50))
    data.lastCards && this.startTimer();
  }

  startTimer() {
    const timer$ = interval(1000);
    const sub = timer$.subscribe((sec) => {
      this.progressbarValue = (sec + 1) * 100 / this.timeLapse;
      this.curSec = sec + 1;
      this._changeDetectorRef.markForCheck();

      if (this.curSec === this.timeLapse) {
        sub.unsubscribe();
        this.bottomSheetRef.dismiss();
      }
    });
  }

  ngOnInit() { }

}
