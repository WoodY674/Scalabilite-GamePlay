import type { NextPage } from 'next'
import React from 'react'
import Game from '@/components/Game'
import axios from "axios";

const Home: NextPage = () => {

    axios.post("http://localhost:3001/session/launch", {
        "avatar": "",
        "userId": 1
    }).then(function (response) {
        console.log(response);
    })

	const gameData = {
		mapBackground: '#00FFFF',
		width: '1400',
		height: '600',
		treasures: [
			{
                id: 1,
				posX: '100',
				posY: '100',
			},
			{
                id: 2,
				posX: '200',
				posY: '200',
			},
			{
                id: 3,
				posX: '300',
				posY: '300',
			},
			// Add more treasures as needed
		],
	}

	return (
		<>
			<h1>Pixel Game</h1>
			<Game gameData={gameData} />
		</>
	)
}

export default Home
