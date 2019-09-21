import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-settings-board',
  templateUrl: './settings-board.component.html',
  styleUrls: ['./settings-board.component.css']
})
export class SettingsBoardComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef<SettingsBoardComponent>,
              @Inject(MAT_BOTTOM_SHEET_DATA) public data: {}) {
      
    }

  ngOnInit() {
  }

}
