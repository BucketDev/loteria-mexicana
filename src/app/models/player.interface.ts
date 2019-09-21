import { Card } from './card.interface';

export interface Player {
    name: string,
    boardUid: string,
    playerBoard: Card[]
}