import React, {useEffect, useState} from 'react'
import Game from '@/components/Game'
import axios from "axios";
import {GameData} from "@/models/interfaces/gameData.interface";
import {useEffectFix} from "../src/helpers/useEffectUtils";
import {getQueryParams} from "../src/helpers/query";

function getRndInteger(min:number, max:number) {
    return Math.floor(Math.random() * (max+1 - min) ) + min;
}

const Home: React.FC = () => {
    const { execOnlyOnce } = useEffectFix();

    const [gameData, setGameData] = useState<GameData|null>(null)

    //@TODO : get user id from token, to set 'userId' in api call and userMail
    useEffect(() => {
        execOnlyOnce(() => {
            if(gameData == null) {
                let userMail: string
                let userId : number
                try {
                    const params = getQueryParams(window.location.search)
                    userId = parseInt(params.get("userId"))
                    userMail = params.get("mail")
                }catch (e){
                    userId = getRndInteger(1,2)
                }
                axios.post(`http://${process.env.NEXT_PUBLIC_BACK_URL}/session/launch`, {
                    "avatar": "",
                    "userId": userId
                }).then(function (response: any) {
                    console.log(response.data);
                    setGameData({
                        mapBackground: response.data.map.backgroundImg,
                        width: response.data.map.width,
                        height: response.data.map.height,
                        sessionId: response.data.map.id,
                        userMail: userMail,
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
