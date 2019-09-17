import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Board } from '../models/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private db: AngularFirestore) { }

  createBoard = (board: Board): Promise<DocumentReference> => 
    this.db.collection('boards').add(board);
}
