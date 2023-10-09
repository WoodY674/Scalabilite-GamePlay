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


export async function checkImage(url:string){
    try {
        const res = await fetch( url );
        const buff = await res.blob();
        return buff.type.startsWith( 'image/' )
    }catch ( e ){
        console.log("an error occured when check image", e)
    }
    return false
}

export class ImageCanva{
    defaultImg: string
    src: string
    img: HTMLImageElement

    constructor(src:string, defaultImg: string) {
        this.defaultImg = defaultImg
        this.src = src
        try {
            if(src == "" || src == null){
                this.src = this.defaultImg
            }
            else{
                checkImage(src).then((res)=>{
                    this.src = res ? src : this.defaultImg
                })
            }
        }catch (e){
            console.log("src error", e)
        }
        this.img = new Image()
        this.img.src = this.src
    }

    draw(canvasCtx: CanvasRenderingContext2D, dx: number, dy: number, dw: number, dh: number){
        canvasCtx.drawImage(this.img, dx, dy, dw, dh)
    }
}

export interface GamesImage{
    treasures: {[name:string]: ImageCanva}
    otherPlayer: {[name:string]: ImageCanva}
}
