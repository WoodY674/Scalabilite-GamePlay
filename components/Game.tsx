import React, { useEffect, useRef, useState } from 'react'
import { GameProps } from '@/models/props/game.props'
import { Player, PlayerInGame } from '@/models/interfaces/player.interface'
import { io } from 'socket.io-client'
import {canvasData, getNotEmpty, isPlayerOverTreasure} from "../src/helpers/canva";
import {Treasure} from "@/models/interfaces/treasore.interface";


const Game: React.FC<GameProps> = ({ gameData }) => {
	const [player, setPlayer] = useState<PlayerInGame>({
		x: gameData.currentPlayer.posX,
		y: gameData.currentPlayer.posY,
        userid: gameData.currentPlayer.userid,
        avatar: getNotEmpty(gameData.currentPlayer.avatar, 'https://upload.wikimedia.org/wikipedia/en/9/9d/Slime_%28Dragon_Quest%29.png'),
		speed: 5,
	})

	const [otherPlayers, setOtherPlayers] = useState<Player[]>(gameData.players)
	const [treasures, setTreasures] = useState<Treasure[]>(gameData.treasures)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const socketRef = useRef<any>(null)

    const myPlayerImage = new Image();
    const mapImage = new Image();
    myPlayerImage.src = player.avatar;
    mapImage.src = getNotEmpty(gameData.mapBackground, 'https://i.pinimg.com/550x/d2/70/08/d27008765980c6a51cedcdaef8b74b2c.jpg')

    useEffect(() => {
        //region canva init
		const canvas = canvasRef.current

		if (!canvas) {
			return // Add a null check here
		}

		const ctx = canvas.getContext('2d')

		if (!ctx) {
			console.error('Unable to get 2D context from canvas')
			return
		}
        //endregion

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
                    if (player.x + player.speed + canvasData.player.width <= canvasWidth) {
                        player.x += player.speed;
                    }
					break
				case 'ArrowUp':
                    if (player.y - player.speed >= 0) {
                        player.y -= player.speed;
                    }
					break
				case 'ArrowDown':
                    if (player.y + player.speed + canvasData.player.height <= canvasHeight) {
                        player.y += player.speed;
                    }
					break
				default:
					break
			}

			socket.emit('move', { userid: player.userid, posX: player.x, posY: player.y })
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
            ctx.drawImage(mapImage, 0 -cameraX, 0 -cameraY, canvasWidth, canvasHeight)

            //region treasures
            // check user is on a treasure
            treasures.forEach((treasure, index) => {
                if (isPlayerOverTreasure(player, treasure)) {
                    socket.emit('claim', {treasureId:treasure.id, userid:player.userid})
                    treasures.splice(index, 1);
                }
            });

            // Draw remaining treasures
            //ctx.fillStyle = 'gold';
            treasures.forEach((treasure) => {
                const treasureImage = new Image();
                treasureImage.src = getNotEmpty(treasure.img, 'https://cdn-icons-png.flaticon.com/512/4230/4230569.png');
                ctx.drawImage(treasureImage, treasure.posX - cameraX, treasure.posY - cameraY, canvasData.treasure.width, canvasData.treasure.height)
            });
            //endregion

			// Draw other players
			ctx.fillStyle = 'red'
			otherPlayers.forEach((p) => {
                const otherPlayerImg = new Image();
                otherPlayerImg.src = getNotEmpty(p.avatar, "https://wikidragonquest.fr/images/thumb/c/c2/Soldat_squelette.png/280px-Soldat_squelette.png")
				ctx.drawImage(otherPlayerImg, p.posX - cameraX, p.posY- cameraY, canvasData.player.width, canvasData.player.height)
			})

            // Draw the current player, last one to be over all others img
            ctx.drawImage(myPlayerImage, player.x - cameraX, player.y - cameraY, canvasData.player.width, canvasData.player.height)

            // Request animation frame
			requestAnimationFrame(gameLoop)
		}

        //region socket
		socket.on('moveConfirmed', (movingPlayer: Player) => {
            if(player.userid != movingPlayer.userid) {
                for (let i = 0; i < otherPlayers.length; i++) {
                    if (movingPlayer.id == otherPlayers[i].id) {
                        const newList = [...otherPlayers]
                        newList[i] = movingPlayer
                        setOtherPlayers(newList)
                        break
                    }
                }
            }
		})
        socket.on('treasureClaimed', (treasureId: number) => {
            for (let i = 0; i < treasures.length; i++) {
                if (treasureId == treasures[i].id) {
                    const newList = [...treasures]
                    newList.splice(i, 1)
                    setTreasures(newList)
                    break
                }

            }
		})
        socket.on('endGame', () => {
            //@TODO : redirect to dashboard page (auth service)
		})
        //endregion

		gameLoop()

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [gameData, player, otherPlayers, treasures])



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
