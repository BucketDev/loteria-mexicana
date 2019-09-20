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

  createPlayer = (uid: string, player: Player): Promise<DocumentReference> => 
    this.db.collection(this.collectionBoardName).doc(uid).collection(this.collectionName).add(player);

  getPlayer = (boardUid: string, uid: string) => this.db.collection(this.collectionBoardName).doc(boardUid).collection(this.collectionName).doc(uid)
    .snapshotChanges().pipe(map(data => {
      let player = data.payload.data();
      player = {
        uid: data.payload.id,
        name: player['name'],
        board: player['board']
      }
      return player;
    }));

  update = (boardUid: string, player: Player) => this.db.collection(this.collectionBoardName)
    .doc(boardUid).collection(this.collectionName)
    .doc(player.uid).update(player);
}
