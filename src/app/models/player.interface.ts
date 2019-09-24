import { Card } from './card.interface';

export interface Player {
    uid?: string,
    name: string,
    boardUid: string,
    playerBoard?: Card[]
}