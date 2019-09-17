import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private db: AngularFirestore) { }

  createBoard = () => {
    return this.db.collection('boards').add({
      creationDate: new Date()
    });
  }
}
