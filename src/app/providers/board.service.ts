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
  collectionPlayerName: string = 'players';
  displayNavBar: boolean = true;

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
        gameStarted: board['gameStarted'],
        gameWon: board['gameWon'],
        cardHistory: board['cardHistory'],
        currentDeck: board['currentDeck']
      }
      return board;
    }));

  getPLayers = (uid: string) => this.db.collection(this.collectionName).doc(uid).collection(this.collectionPlayerName)
    .snapshotChanges().pipe(map(data =>  data.map(player => player.payload.doc.data())))

  update = (uid: string, board: Board) => this.db.collection(this.collectionName).doc(uid).update(board);
}
