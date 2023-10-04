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
                    if (player.x - player.speed >= 0) {
                        player.x -= player.speed;
                    }
					break
				case 'ArrowRight':
                    if (player.x + player.speed + 20 <= canvasWidth) {
                        player.x += player.speed;
                    }
					break
				case 'ArrowUp':
                    if (player.y - player.speed >= 0) {
                        player.y -= player.speed;
                    }
					break
				case 'ArrowDown':
                    if (player.y + player.speed + 20 <= canvasHeight) {
                        player.y += player.speed;
                    }
					break
				default:
					break
			}
		}

		window.addEventListener('keydown', handleKeyDown)

        const canvasWidth = canvas.width
        const canvasHeight = canvas.height

		const gameLoop = () => {
            // Calculate the camera position to center the player
            const cameraX = player.x - canvasWidth / 2
            const cameraY = player.y - canvasHeight / 2

			// Clear the canvas
			ctx.clearRect(0, 0, canvasWidth, canvasHeight)

			// Set background color from gameData
			ctx.fillStyle = gameData.mapBackground || 'blue'
			ctx.fillRect(0, 0, canvasWidth, canvasHeight)

			// Draw the player
			ctx.fillStyle = 'red'
            ctx.fillRect(player.x - cameraX, player.y - cameraY, 20, 20)
            // Vérifier si le joueur a atteint un trésor
            gameData.treasures.forEach((treasure, index) => {
                const posX = parseInt(treasure.posX);
                const posY = parseInt(treasure.posY);

                if (player.x == posX && player.y && posY) {
                    // Le joueur a atteint un trésor, alors retirez-le du tableau
                    gameData.treasures.splice(index, 1);
                }
            });

            // ...

            // Dessinez les trésors restants
            ctx.fillStyle = 'gold';
            gameData.treasures.forEach((treasure) => {
                const posX = parseInt(treasure.posX);
                const posY = parseInt(treasure.posY);
                ctx.fillRect(posX - cameraX, posY - cameraY, 20, 20);
            });

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
