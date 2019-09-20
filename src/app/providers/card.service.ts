import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Card } from '../models/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  collectionName: string = 'cards';

  constructor(private db: AngularFirestore) { }

  getCards = () => this.db.collection(this.collectionName)
    .get().pipe(map(data => {
      let cards: Card[] = []
      data.docs.forEach(docSnapshot => {
        let _card = docSnapshot.data();
        let card: Card;
        card = {
          uid: docSnapshot.id,
          url: _card['url']
        }
        cards.push(card);
      });
      return cards;
    }));
}
