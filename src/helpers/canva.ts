import { PlayerInGame } from '@/models/interfaces/player.interface';
import { Treasure } from '@/models/interfaces/treasore.interface';

export const canvasData = {
    player:{
        width:30,
        height:30
    },
    treasure:{
        width:30,
        height:30
    }
}

export function isPlayerOverTreasure(player:PlayerInGame, treasure:Treasure){
    if(player.x > treasure.posX + canvasData.treasure.width || treasure.posX > player.x + canvasData.player.width)
        return false
    if(player.y > treasure.posY + canvasData.treasure.height || treasure.posY > player.y + canvasData.player.height)
        return false
    return true
}

export function getNotEmpty(val:any, defaultVal:any){
    return (val == null || val == "" ? defaultVal : val)
}
