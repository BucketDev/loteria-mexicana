import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, DocumentChangeAction, DocumentData, DocumentChange } from '@angular/fire/firestore';
import { Player } from '../models/player.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  collectionBoardName: string = 'boards';
  collectionName: string = 'players';

  constructor(private db: AngularFirestore) { }

  post = (boardUid: string, player: Player): Promise<DocumentReference> => 
    this.db.collection(this.collectionBoardName).doc(boardUid).collection(this.collectionName).add(player);

  get = (boardUid: string) => this.db.collection(this.collectionBoardName).doc(boardUid)
    .collection(this.collectionName).snapshotChanges().pipe(map((actions: DocumentChangeAction<DocumentData>[]) => {
      let players: Player[] = [];
      actions.forEach((action: DocumentChangeAction<DocumentReference>) => {
        if (action.type === 'added' || action.type === 'modified') {
          let _player = action.payload.doc.data();
          let player: Player = {
            uid: _player['uid'],
            boardUid: _player['boardUid'],
            name: _player['name']
          }
          players.push(player);
        }
      })
      return players;
    }));

  put = (boardUid: string, player: Player): Promise<void> =>
    this.db.collection(this.collectionBoardName).doc(boardUid).collection(this.collectionName).doc(player.uid).set(player);
}
