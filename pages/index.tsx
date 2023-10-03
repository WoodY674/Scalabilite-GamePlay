import type { NextPage } from 'next'
import React from 'react'
import Game from '@/components/Game'

const Home: NextPage = () => {
	const gameData = {
		mapBackground: '#00FFFF',
		width: '800',
		height: '800',
		treasures: [
			{
				posX: '100',
				posY: '100',
			},
			{
				posX: '200',
				posY: '200',
			},
			{
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
