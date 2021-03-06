import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, DocumentReference, DocumentSnapshot } from '@angular/fire/firestore';

import { Board } from '../models/board.interface';
import { Player } from '../models/player.interface';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  collectionName: string = 'boards';
  displayNavBar: boolean = true;

  constructor(private db: AngularFirestore) { }

  post = (board: Board): Promise<DocumentReference> => 
    this.db.collection(this.collectionName).add(board);

  get = (id: string) => this.db.collection(this.collectionName).doc(id)
    .snapshotChanges().pipe(map(data => {
      let board = data.payload.data();
      board = {
        uid: data.payload.id,
        name: board['name'],
        hostName: board['hostName'],
        creationDate: board['creationDate'],
        gameStarted: board['gameStarted'],
        gameWon: board['gameWon'],
        winners: board['winners']
      }
      return board;
    }));

  put = (board: Board) => this.db.collection(this.collectionName).doc(board.uid).update(board);
}
