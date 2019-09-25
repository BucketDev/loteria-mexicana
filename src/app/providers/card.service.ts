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
        cardNumber: idx,
        sound: `assets/sounds/${idx}.mp3`,
        url: `assets/img/${idx}.jpg`
      };
      //img preload
      (new Image()).src = card.url;
      cards.push(card);
    }
    return cards;
  }

}
