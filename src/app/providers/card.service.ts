import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Card } from '../models/card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor() { }

  getCards = () => {
    let cards: Card[] = []
    for(let idx = 1; idx <= 54; idx++) {
      let card: Card = {
        uid: idx,
        url: `assets/img/${idx}.jpg`
      }
      cards.push(card);
    }
    return cards;
  }

}
