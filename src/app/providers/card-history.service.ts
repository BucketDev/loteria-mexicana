import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Card } from '../models/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardHistoryService {

  collectionName: string = 'cardHistories';

  constructor(private db: AngularFirestore) { }

  post = (boardUid: string): Promise<void> => 
    this.db.collection(this.collectionName).doc(boardUid).set({
      cards: []
    });
  
  get = (boardUid: string) => this.db.collection(this.collectionName).doc(boardUid)
    .snapshotChanges().pipe(map(data => {
      let cards: Card[] = []
      data.payload.data()['cards'].forEach(_card => {
        let card: Card = {
          uid: _card['uid'],
          url: _card['url']
        }
        cards.push(card);
      });
      return cards;
    }));
  
  put = (boardUid: string, cards: Card[]) =>
    this.db.collection(this.collectionName).doc(boardUid).update({cards});
}
