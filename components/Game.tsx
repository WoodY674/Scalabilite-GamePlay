import React, { useEffect, useRef, useState } from 'react'
import { GameProps } from '@/models/props/game.props'
import { Player, PlayerInGame } from '@/models/interfaces/player.interface'
import { io } from 'socket.io-client'
import {canvasData, GamesImage, ImageCanva, isPlayerOverTreasure} from "../src/helpers/canva";
import {ScoreOnUpdate, Treasure} from "@/models/interfaces/treasore.interface";

const Game: React.FC<GameProps> = ({ gameData }) => {
	const [player, setPlayer] = useState<PlayerInGame>({
		x: gameData.currentPlayer.posX,
		y: gameData.currentPlayer.posY,
        userid: gameData.currentPlayer.userid,
        avatar: gameData.currentPlayer.avatar,
        userMail: gameData.userMail,
		speed: 5,
	})

	const [otherPlayers, setOtherPlayers] = useState<Player[]>(gameData.players)
	const [treasures, setTreasures] = useState<Treasure[]>(gameData.treasures)
    const [score, setScore] = useState(0)
    const [images, setImages] = useState<GamesImage>({
        treasures: {},
        otherPlayer: {},
    })

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const socketRef = useRef<any>(null)
    const myPlayerImage = new ImageCanva(player.avatar,'https://upload.wikimedia.org/wikipedia/en/9/9d/Slime_%28Dragon_Quest%29.png');
    const mapImage = new ImageCanva(gameData.mapBackground, 'https://i.pinimg.com/550x/d2/70/08/d27008765980c6a51cedcdaef8b74b2c.jpg');

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

        treasures.forEach((treasure) => {
            images.treasures[treasure.id.toString()] = new ImageCanva(treasure.img, 'https://cdn-icons-png.flaticon.com/512/4230/4230569.png')
        });
        otherPlayers.forEach((p) => {
            images.otherPlayer[p.id.toString()] = new ImageCanva(p.avatar, "https://wikidragonquest.fr/images/thumb/c/c2/Soldat_squelette.png/280px-Soldat_squelette.png")
        })

		const gameLoop = () => {
            // Calculate the camera position to center the player
            const cameraX = player.x - canvasWidth / 2
            const cameraY = player.y - canvasHeight / 2

			// Clear the canvas
			ctx.clearRect(0, 0, canvasWidth, canvasHeight)

			// Set background color from gameData
            mapImage.draw(ctx, 0 -cameraX, 0 -cameraY, canvasWidth, canvasHeight)

            //region treasures
            // check user is on a treasure
            treasures.forEach((treasure, index) => {
                if (isPlayerOverTreasure(player, treasure)) {
                    socket.emit('claim', {treasureId:treasure.id, userid:player.userid, sessionId:gameData.sessionId, userMail:player.userMail})
                    treasures.splice(index, 1);
                }
            });

            // Draw remaining treasures
            treasures.forEach((treasure) => {
                images.treasures[treasure.id.toString()].draw(ctx, treasure.posX - cameraX, treasure.posY - cameraY,canvasData.treasure.width, canvasData.treasure.height)
            });
            //endregion

			// Draw other players
			otherPlayers.forEach((p) => {
                images.otherPlayer[p.id.toString()].draw(ctx, p.posX - cameraX, p.posY- cameraY, canvasData.player.width, canvasData.player.height)
            })

            // Draw the current player, last one to be over all others img
            myPlayerImage.draw(ctx, player.x - cameraX, player.y - cameraY, canvasData.player.width, canvasData.player.height)

            // Request animation frame
			requestAnimationFrame(gameLoop)
		}

        //region socket
		socket.on(`newPlayer/${gameData.sessionId}`, (newPlayer: Player) => {
            if(player.userid != newPlayer.userid) {
                for (let i = 0; i < otherPlayers.length; i++) {
                    if (newPlayer.id == otherPlayers[i].id) {
                        return
                    }
                }
                setOtherPlayers([...otherPlayers, newPlayer])
            }
		})
		socket.on(`moveConfirmed/${gameData.sessionId}`, (movingPlayer: Player) => {
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
        socket.on(`treasureClaimed/${gameData.sessionId}`, (treasureId: number) => {
            for (let i = 0; i < treasures.length; i++) {
                if (treasureId == treasures[i].id) {
                    const newList = [...treasures]
                    newList.splice(i, 1)
                    setTreasures(newList)
                    break
                }
            }
		})
        socket.on(`endGame/${gameData.sessionId}`, () => {
            //@TODO : redirect to dashboard page (auth service)
            window.location.href = `http://${(process.env.SERVICE_AUTH ?? "localhost:4200")}/`
		})
        socket.on(`score/${player.userid}`, (data: ScoreOnUpdate) => {
            setScore(data.score)
		})
        //endregion

		gameLoop()

		return () => {
			window.removeEventListener('keydown', handleKeyDown)
		}
	}, [gameData, player, otherPlayers, treasures, images])


	return (
		<div>
            <div>Score : {score}</div>
            <div style={{border:"3px black solid",
                width:"400px", height:"400px",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                overflow:"hidden",
                background:"url(https://img.freepik.com/premium-vector/cartoon-wood-floor-tiles-pattern_172107-1063.jpg)"}}>
                <canvas
                    ref={canvasRef}
                    width={gameData.width || 800}
                    height={gameData.height || 800}
                />
            </div>
		</div>
	)
}

export default Game
