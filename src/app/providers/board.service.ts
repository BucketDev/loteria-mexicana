import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';

import { Board } from '../models/board.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  collectionName: string = 'boards';

  constructor(private db: AngularFirestore) { }

  createBoard = (board: Board): Promise<DocumentReference> => 
    this.db.collection(this.collectionName).add(board);

  getBoard = (id: string) => this.db.collection(this.collectionName).doc(id)
    .snapshotChanges().pipe(map(data => {
      let board = data.payload.data();
      board = {
        uid: data.payload.id,
        name: board['name'],
        hostName: board['hostName'],
        creationDate: board['creationDate'],
        players: board['players'],
        gameStarted: board['gameStarted'],
        gameWon: board['gameWon'],
        cardHistory: board['cardHistory'],
        currentDeck: board['currentDeck']
      }
      return board;
    }));

  update = (uid: string, board: Board) => this.db.collection(this.collectionName).doc(uid).update(board);
}
