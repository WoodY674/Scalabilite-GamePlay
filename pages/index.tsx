import React, {useEffect, useState} from 'react'
import Game from '@/components/Game'
import axios from "axios";
import {GameData} from "@/models/interfaces/gameData.interface";
import {useEffectFix} from "../src/helpers/useEffectUtils";

function getRndInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max+1 - min) ) + min;
}

const Home: React.FC = () => {
    const { execOnlyOnce } = useEffectFix();

    const [gameData, setGameData] = useState<GameData|null>(null)

    //@TODO : get user id from token, to set 'userId' in api call
    useEffect(() => {
        execOnlyOnce(() => {
            if(gameData == null) {
                axios.post(`http://${process.env.NEXT_PUBLIC_BACK_URL}/session/launch`, {
                    "avatar": "",
                    "userId": getRndInteger(1, 2)
                }).then(function (response: any) {
                    console.log(response.data);
                    setGameData({
                        mapBackground: response.data.map.backgroundImg,
                        width: response.data.map.width,
                        height: response.data.map.height,
                        treasures: response.data.treasures,
                        players: response.data.players,
                        currentPlayer: response.data.currentPlayer,
                    })
                }).catch(function () {
                    console.log("err")
                })
            }
        });

    }, [])

    //@TODO : make a beautiful loader, instead of the simple msg Loading your game
    return (
        <>
            <h1>Pixel Game</h1>
            <div>Player {gameData?.currentPlayer.userid}</div>
            { gameData == null
                    ? <div>Loading your game</div>
                    : <Game gameData={gameData} />
            }
        </>
    )
}

export default Home
