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
			console.log(gameData.treasures)

			socket.emit('move', { axisX: player.x, axisY: player.y })
		}

		window.addEventListener('keydown', handleKeyDown)

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
			// Clear the canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// Set background color from gameData
			ctx.fillStyle = gameData.mapBackground || 'blue'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			// Draw the current player
			ctx.fillStyle = 'red'
			ctx.fillRect(player.x, player.y, 20, 20)

			// Draw other players
			ctx.fillStyle = 'blue'
			otherPlayers.forEach((p) => {
				ctx.fillRect(p.x, p.y, 20, 20)
			})

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
