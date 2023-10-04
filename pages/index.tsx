import type { NextPage } from 'next'
import React from 'react'
import Game from '@/components/Game'
import axios from "axios";
import {GameData} from "@/models/interfaces/gameData.interface";

const Home: NextPage = () => {

// TODO: Récupérer le response body et utiliser les données pour les mettre en gameData
    const gameData : GameData = {
        mapBackground: '#00FFFF',
        width: 1400,
        height: 600,
        treasures: [
            {
                id: 1,
                posX: 100,
                posY: 100,
                img: "",
                value: 2
            },
            {
                id: 2,
                posX: 200,
                posY: 200,
                img: "",
                value:1
            },
            {
                id: 3,
                posX: 300,
                posY: 300,
                img: "",
                value:5
            },
            // Add more treasures as needed
        ],
        players: [
            {
                id:1,
                userId:1,
                posX:4,
                posY:5,
                avatar: ""
            }
        ]
    }

    axios.post("http://localhost:3001/session/launch", {
        "avatar": "",
        "userId": 1
    }).then(function (response) {

        console.log(response.data);
        gameData["mapBackground"] = response.data.map.background
        gameData["width"] = response.data.map.width
        gameData["height"] = response.data.map.height
        gameData["treasures"] = response.data.treasures
        gameData["players"] = response.data.players
    })



	return (
		<>
			<h1>Pixel Game</h1>
			<Game gameData={gameData} />
		</>
	)
}

export default Home
