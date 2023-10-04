import React, { useEffect, useRef, useState } from 'react'
import { GameProps } from '@/models/props/game.props'
import { Player } from '@/models/interfaces/player.interface'
import { io } from 'socket.io-client'



    const Game: React.FC<GameProps> = ({ gameData }) => {
	const [player, setPlayer] = useState({
		x: 40,
		y: 40,
		speed: 5,
	})

    const [score, setScore] = useState()
	const [otherPlayers, setOtherPlayers] = useState<Player[]>([])

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

			socket.emit('move', { axisX: player.x, axisY: player.y })
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

            /*// Configuration du WebSocket
        //const socket = io(`ws://${process.env.NEXT_PUBLIC_BACK_URL}`);
        socket.on('connect', () => {
        // Lorsque la connexion WebSocket est établie, envoyez l'ID du joueur au serveur pour demander le score
        socket.emit('getPlayerScore', { playerId: 'ID_DU_JOUEUR_ACTUEL' });
  });

        socket.on('playerScore', (
                data: { score: React.SetStateAction<undefined>; }) => {
            // Mise à jour du score du joueur actuel
        setScore(data.score);
  });*/

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
			ctx.fillRect(player.x, player.y, 20, 20)

			// Draw other players
			ctx.fillStyle = 'blue'
			otherPlayers.forEach((p) => {
				ctx.fillRect(p.x, p.y, 20, 20)
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
				width={parseInt(gameData.width) || 800}
				height={parseInt(gameData.height) || 800}
			/>
		</div>
	)
}

export default Game
