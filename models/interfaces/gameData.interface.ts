import { Treasure } from '@/models/interfaces/treasore.interface'
import { Player } from '@/models/interfaces/player.interface';

export interface GameData {
	mapBackground: string
	width: number
	height: number
    sessionId: number
    userMail: string
	treasures: Treasure[]
    players: Player[]
    currentPlayer: Player
}
