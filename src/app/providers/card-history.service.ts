import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference, QuerySnapshot, QueryDocumentSnapshot, DocumentChangeAction, DocumentData, DocumentChange } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Card } from '../models/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardHistoryService {

  collectionBoardName: string = 'boards';
  collectionName: string = 'cardsHistory';

  constructor(private db: AngularFirestore) { }
  
  get = (boardUid: string) => this.db.collection(this.collectionBoardName).doc(boardUid)
    .collection(this.collectionName, ref => ref.orderBy('order', 'desc')).snapshotChanges().pipe(map((actions: DocumentChangeAction<DocumentData>[]) => {
      let cards: Card[] = []
      actions.forEach((action: DocumentChangeAction<DocumentData>) => {
        if(action.type === 'added') {
          let _card = action.payload.doc.data();
          let card: Card = {
            cardNumber: _card['cardNumber'],
            sound: _card['sound'],
            url: _card['url']
          }
          cards.push(card);
        }
      });
      return cards;
    }));
  
  put = (boardUid: string, card: Card) =>
    this.db.collection(this.collectionBoardName).doc(boardUid)
      .collection(this.collectionName).add(card);

  delete = (boardUid: string) =>
    this.db.collection(this.collectionBoardName).doc(boardUid)
      .collection(this.collectionName).get().subscribe((qs: QuerySnapshot<Card>) => {
        const batch = this.db.firestore.batch();
        qs.forEach((qds: QueryDocumentSnapshot<Card>) => {
          batch.delete(qds.ref);
        });
        batch.commit()
      });
}
