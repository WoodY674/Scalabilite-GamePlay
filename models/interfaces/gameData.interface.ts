import { Treasure } from '@/models/interfaces/treasore.interface'

export interface GameData {
	mapBackground: string
	width: string
	height: string
	treasures: Treasure[]
}
