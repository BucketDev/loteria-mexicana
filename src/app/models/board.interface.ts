import { Player } from './player.interface';
import { Card } from './card.interface';

export interface Board {
    uid?: string,
    name: string,
    hostName: string,
    creationDate: Date,
    cardHistory?: Card[],
    currentDeck?: Card[],
    players: Player[],
    gameStarted: boolean,
    gameWon: boolean
}