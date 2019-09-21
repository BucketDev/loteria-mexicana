import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Player } from '../models/player.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  collectionBoardName: string = 'boards';
  collectionName: string = 'players';

  constructor(private db: AngularFirestore) { }

  createPlayer = (boardUid: string, player: Player): Promise<DocumentReference> => 
    this.db.collection(this.collectionBoardName).doc(boardUid)
      .collection(this.collectionName).add(player);

  getPlayers = (boardUid: string) => this.db.collection(this.collectionBoardName).doc(boardUid)
    .collection(this.collectionName).snapshotChanges().pipe(map(data => {
      let players: Player[] = [];
      data.forEach((data) => {
        let player = data.payload.doc.data();
        players.push({
          uid: data.payload.doc.id,
          boardUid: player['boardUid'],
          name: player['name'],
          playerBoard: []
        });
      });
      return players;
    }));
}
