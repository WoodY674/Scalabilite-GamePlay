// components/Game.js
import React, { useEffect, useRef } from 'react'
import { GameProps } from '@/models/props/game.props'

const Game: React.FC<GameProps> = ({ gameData }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const player = {
		x: 50,
		y: 50,
		speed: 5,
	}

	useEffect(() => {
		const canvas = canvasRef.current

		if (!canvas) {
			return // Add a null check here
		}

		const ctx = canvas.getContext('2d')

		if (!ctx) {
			console.error('Unable to get 2D context from canvas')
			return
		}

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'ArrowLeft':
					player.x -= player.speed
					break
				case 'ArrowRight':
					player.x += player.speed
					break
				case 'ArrowUp':
					player.y -= player.speed
					break
				case 'ArrowDown':
					player.y += player.speed
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)

		const gameLoop = () => {
			// Clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// Set background color from gameData
			ctx.fillStyle = gameData.mapBackground || 'blue'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// Draw the player
			ctx.fillStyle = 'red'
			ctx.fillRect(player.x, player.y, 20, 20)

			// Draw treasures
			ctx.fillStyle = 'gold'
			gameData.treasures.forEach((treasure) => {
				const posX = parseInt(treasure.posX)
				const posY = parseInt(treasure.posY)
				ctx.fillRect(posX, posY, 20, 20)
			})

			// Request animation frame
			requestAnimationFrame(gameLoop)
		}

		gameLoop()

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [gameData])

	return (
		<div>
			<canvas
				ref={canvasRef}
				width={parseInt(gameData.width) || 800}
				height={parseInt(gameData.height) || 800}
			/>
		</div>
	)
}

export default Game
