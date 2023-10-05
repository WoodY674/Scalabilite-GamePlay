import React, { useEffect, useRef, useState } from 'react'
import { GameProps } from '@/models/props/game.props'
import { Player } from '@/models/interfaces/player.interface'
import { io } from 'socket.io-client'

const Game: React.FC<GameProps> = ({ gameData }) => {
	const [player, setPlayer] = useState({
		x: gameData.currentPlayer.posX,
		y: gameData.currentPlayer.posY,
        id: gameData.currentPlayer.userid,
		speed: 5,
	})

	const [otherPlayers, setOtherPlayers] = useState<Player[]>(gameData.players)

	const canvasRef = useRef<HTMLCanvasElement | null>(null)

	const socketRef = useRef<any>(null)

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

		// Create the WebSocket connection only once
		if (!socketRef.current) {
			socketRef.current = io(`ws://${process.env.NEXT_PUBLIC_BACK_URL}`)
		}

		const socket = socketRef.current

        const myPlayerImage = new Image();
        myPlayerImage.src = 'ic_launcher.png';

        const treasureImage = new Image();
        treasureImage.src = 'ic_launcher.png';

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
			console.log(gameData.treasures)

			socket.emit('move', { id: player.id, posX: player.x, posY: player.y })
		}

		window.addEventListener('keydown', handleKeyDown)

        const canvasWidth = canvas.width
        const canvasHeight = canvas.height
		/*
		socket.on('playerPosition', (data: any) => {
			// Handle updates to other player positions
			setOtherPlayers((prevPlayers) => {
				const updatedPlayers = prevPlayers.filter((p) => p.id !== data.id)
				return [...updatedPlayers, data]
			})
		})
*/

		const gameLoop = () => {
            // Calculate the camera position to center the player
            const cameraX = player.x - canvasWidth / 2
            const cameraY = player.y - canvasHeight / 2

			// Clear the canvas
			ctx.clearRect(0, 0, canvasWidth, canvasHeight)

			// Set background color from gameData
			ctx.fillStyle = gameData.mapBackground || 'blue'
			ctx.fillRect(0, 0, canvasWidth, canvasHeight)

			// Draw the current player
			//ctx.fillStyle = 'red'
            ctx.drawImage(myPlayerImage, player.x - cameraX, player.y - cameraY, 20, 20)
            //ctx.fillRect(player.x - cameraX, player.y - cameraY, 20, 20)
            // Vérifier si le joueur a atteint un trésor
            gameData.treasures.forEach((treasure, index) => {
                const posX = treasure.posX;
                const posY = treasure.posY;

                if (player.x == posX && player.y == posY) {
                    // Le joueur a atteint un trésor, alors retirez-le du tableau
                    gameData.treasures.splice(index, 1);
                    socket.emit('claim', treasure.id)
                }
            });

            // Dessinez les trésors restants
            //ctx.fillStyle = 'gold';
            gameData.treasures.forEach((treasure) => {
                const posX = treasure.posX;
                const posY = treasure.posY;
                ctx.drawImage(treasureImage, posX - cameraX, posY - cameraY, 20, 20)
                //ctx.fillRect(posX - cameraX, posY - cameraY, 20, 20);
            });
			ctx.fillRect(player.x, player.y, 20, 20)

			// Draw other players
			ctx.fillStyle = 'green'
			otherPlayers.forEach((p) => {
				ctx.fillRect(p.posX, p.posY, 20, 20)
			})

			// Request animation frame
			requestAnimationFrame(gameLoop)
		}

		/*		socket.on('playersList', (players: any) => {
			setOtherPlayers(players)
		})*/

		gameLoop()

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [gameData, player, otherPlayers])



	return (
		<div>
			<canvas
				ref={canvasRef}
				width={gameData.width || 800}
				height={gameData.height || 800}
			/>
		</div>
	)
}

export default Game
