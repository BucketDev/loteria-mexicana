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

  post = (boardUid: string): Promise<void> => 
    this.db.collection(this.collectionName).doc(boardUid).set({
      players: []
    });
  
  postPLayers = (boardUid: string, players: Player[]): Promise<void> => 
    this.db.collection(this.collectionName).doc(boardUid).set({ players });

  get = (boardUid: string) => this.db.collection(this.collectionName).doc(boardUid)
    .snapshotChanges().pipe(map(data => {
      let players: Player[] = [];
      data.payload.data()['players'].forEach((_player) => {
        let player: Player = {
          uid: _player['uid'],
          boardUid: _player['boardUid'],
          name: _player['name'],
          playerBoard: []
        };
        players.push(player);
      });
      return players;
    }));

  put = (boardUid: string, player: Player) =>
    this.db.collection(this.collectionName)
}
